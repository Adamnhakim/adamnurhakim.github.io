/**
 * Interactive Distributed System Network Background
 * Simulates microservices and data packets traveling between service nodes.
 */
(function () {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = {
    x: null,
    y: null,
    radius: 140
  };

  const isDarkMode = () => !document.body.classList.contains('light-theme');

  class Node {
    constructor(x, y) {
      this.x = x || Math.random() * width;
      this.y = y || Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.75;
      this.vy = (Math.random() - 0.5) * 0.75;
      this.radius = Math.random() * 2 + 1.8;
      this.baseColor = Math.random() > 0.85 ? '#10b981' : (Math.random() > 0.6 ? '#6366f1' : '#00f2fe');
      this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = dx / distance;
          const directionY = dy / distance;
          this.x += directionX * force * 1.2;
          this.y += directionY * force * 1.2;
        }
      }

      this.pulse += 0.03;
    }

    draw() {
      ctx.beginPath();
      const currentRadius = this.radius + Math.sin(this.pulse) * 0.6;
      ctx.arc(this.x, this.y, Math.max(1, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.baseColor;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Data Packet traveling on lines
  class Packet {
    constructor(fromNode, toNode) {
      this.from = fromNode;
      this.to = toNode;
      this.progress = 0;
      this.speed = 0.015 + Math.random() * 0.02;
      this.color = '#38bdf8';
    }

    update() {
      this.progress += this.speed;
      return this.progress <= 1;
    }

    draw() {
      const px = this.from.x + (this.to.x - this.from.x) * this.progress;
      const py = this.from.y + (this.to.y - this.from.y) * this.progress;

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f2fe';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  let nodes = [];
  let packets = [];
  const nodeCount = Math.min(Math.floor((width * height) / 16000), 75);

  function init() {
    nodes = [];
    packets = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }
  }

  function connectNodes() {
    const maxDist = 135;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * (isDarkMode() ? 0.22 : 0.12);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = isDarkMode() ? `rgba(56, 189, 248, ${alpha})` : `rgba(14, 116, 144, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Occasionally spawn a data packet
          if (Math.random() < 0.0006 && packets.length < 15) {
            packets.push(new Packet(nodes[i], nodes[j]));
          }
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();
    }

    connectNodes();

    // Update and draw packets
    for (let i = packets.length - 1; i >= 0; i--) {
      if (packets[i].update()) {
        packets[i].draw();
      } else {
        packets.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  init();
  animate();
})();
