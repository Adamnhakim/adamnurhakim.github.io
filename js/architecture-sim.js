/**
 * Interactive System Architecture & High Availability Simulator
 * Designed for Adam Nur Hakim - Software Engineering Lead / Technical Lead Portfolio
 * Demonstrates real-world distributed systems, auto-scaling, caching, and RCA recovery.
 */

(function () {
  const simState = {
    mode: 'normal', // normal, spike, outage
    rps: 1250,
    latency: 14, // ms
    cacheHitRate: 91.5, // %
    errorRate: 0.00, // %
    activePods: 4,
    queueDepth: 120,
    systemStatus: 'OPTIMAL',
    isAutoScaling: false
  };

  let animationInterval = null;

  // DOM elements
  const elRps = document.getElementById('metric-rps');
  const elLatency = document.getElementById('metric-latency');
  const elCache = document.getElementById('metric-cache');
  const elErrors = document.getElementById('metric-errors');
  const elPods = document.getElementById('metric-pods');
  const elQueue = document.getElementById('metric-queue');
  const elStatus = document.getElementById('system-health-badge');
  const elSlider = document.getElementById('traffic-slider');
  const elSliderVal = document.getElementById('traffic-slider-val');
  const elLogConsole = document.getElementById('sim-console-output');

  function addLog(msg, type = 'info') {
    if (!elLogConsole) return;
    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = `sim-log-line ${type}`;

    let color = '#38bdf8';
    let icon = 'ℹ';
    if (type === 'warn') { color = '#f59e0b'; icon = '⚠'; }
    if (type === 'error') { color = '#ef4444'; icon = '✖'; }
    if (type === 'success') { color = '#10b981'; icon = '✔'; }

    line.innerHTML = `<span style="color:#64748b;">[${time}]</span> <span style="color:${color}; font-weight:600;">[${icon} ${type.toUpperCase()}]</span> ${msg}`;
    elLogConsole.appendChild(line);
    elLogConsole.scrollTop = elLogConsole.scrollHeight;

    // Keep logs reasonable length
    while (elLogConsole.children.length > 25) {
      elLogConsole.removeChild(elLogConsole.firstChild);
    }
  }

  function updateDisplay() {
    if (elRps) elRps.textContent = simState.rps.toLocaleString();
    if (elLatency) elLatency.textContent = `${Math.round(simState.latency)} ms`;
    if (elCache) elCache.textContent = `${simState.cacheHitRate.toFixed(1)}%`;
    if (elErrors) elErrors.textContent = `${simState.errorRate.toFixed(2)}%`;
    if (elPods) elPods.textContent = `${simState.activePods} Pods`;
    if (elQueue) elQueue.textContent = `${simState.queueDepth} msgs`;

    if (elStatus) {
      elStatus.className = `health-status ${simState.systemStatus.toLowerCase()}`;
      elStatus.textContent = simState.systemStatus;
    }

    // Pulse nodes visually
    const nodes = document.querySelectorAll('.arch-node');
    nodes.forEach(node => {
      if (simState.mode === 'outage' && node.dataset.service === 'transaction') {
        node.classList.add('node-degraded');
        node.classList.remove('node-active');
      } else {
        node.classList.remove('node-degraded');
        node.classList.add('node-active');
      }
    });
  }

  function triggerNormalState() {
    simState.mode = 'normal';
    simState.rps = 1420;
    simState.latency = 12 + Math.random() * 4;
    simState.cacheHitRate = 92.4;
    simState.errorRate = 0.00;
    simState.activePods = 4;
    simState.queueDepth = 85;
    simState.systemStatus = 'HEALTHY';
    if (elSlider) elSlider.value = 1420;
    if (elSliderVal) elSliderVal.textContent = '1,420 RPS';

    addLog('System nominal. Microservices cluster running smoothly on Kubernetes k8s.', 'info');
    addLog('Grafana alerts: Green. Redis hit ratio 92.4%, p99 latency: 13ms.', 'success');
    updateDisplay();
  }

  function triggerTrafficSpike() {
    simState.mode = 'spike';
    addLog('⚡ TRAFFIC SURGE DETECTED! Banking payday rush & high concurrent users incoming...', 'warn');
    
    simState.rps = 48500;
    simState.latency = 45;
    simState.queueDepth = 3400;
    simState.systemStatus = 'SCALING';
    updateDisplay();

    // HPA (Horizontal Pod Autoscaler) kicks in
    setTimeout(() => {
      addLog('k8s HPA triggered: Target CPU > 75%. Autoscaling pods from 4 to 12...', 'info');
      simState.activePods = 8;
      simState.cacheHitRate = 96.8;
      updateDisplay();
    }, 900);

    setTimeout(() => {
      addLog('Redis Cache warmup complete: 96.8% reads offloaded from primary database.', 'success');
      addLog('Message Broker (Queue) buffering asynchronous event settlement. Concurrency stabilized.', 'success');
      simState.activePods = 12;
      simState.latency = 21;
      simState.queueDepth = 850;
      simState.systemStatus = 'STABILIZED';
      updateDisplay();
    }, 2200);

    setTimeout(() => {
      addLog('Spike sustained at 48k+ RPS with zero packet drops. SLA 99.99% preserved.', 'success');
    }, 3200);
  }

  function triggerOutageAndRCA() {
    simState.mode = 'outage';
    addLog('🚨 SIMULATING FAILURE: Downstream Database Connection Pool Saturation on Core Banking!', 'error');
    simState.systemStatus = 'INCIDENT';
    simState.latency = 185;
    simState.errorRate = 3.24;
    updateDisplay();

    setTimeout(() => {
      addLog('Grafana Alert fired: Transaction P99 > 150ms. Alert routed to Squad Lead.', 'warn');
      addLog('🛡 Circuit Breaker tripped: Degrading gracefully, returning cached read model & queuing write mutations.', 'warn');
      simState.errorRate = 0.45;
      simState.latency = 42;
      updateDisplay();
    }, 1200);

    setTimeout(() => {
      addLog('🔍 RCA in progress: Isolated runaway unbounded query; Read replica failover auto-promoted.', 'info');
      addLog('🛠 Lead Mitigation applied: Connection pool resized, query indexed, circuit breaker reset.', 'success');
      simState.activePods = 6;
      simState.errorRate = 0.00;
      simState.latency = 14;
      simState.systemStatus = 'RECOVERED';
      updateDisplay();
    }, 2800);

    setTimeout(() => {
      addLog('🎉 Incident Resolved: Zero data loss, post-mortem RCA document generated.', 'success');
    }, 4000);
  }

  function handleSliderChange(val) {
    const num = parseInt(val, 10);
    simState.rps = num;
    if (elSliderVal) elSliderVal.textContent = `${num.toLocaleString()} RPS`;

    // Dynamic latency & pod calculations
    if (num < 5000) {
      simState.activePods = 4;
      simState.latency = 11 + (num / 1000) * 1.5;
      simState.queueDepth = Math.round(num * 0.05);
      simState.systemStatus = 'HEALTHY';
    } else if (num < 25000) {
      simState.activePods = 8;
      simState.latency = 18 + (num / 5000) * 2;
      simState.queueDepth = Math.round(num * 0.08);
      simState.systemStatus = 'HIGH LOAD';
    } else {
      simState.activePods = Math.min(24, Math.round(num / 3000));
      simState.latency = 24 + (num / 15000) * 3;
      simState.queueDepth = Math.round(num * 0.12);
      simState.systemStatus = 'SCALED';
    }
    updateDisplay();
  }

  function init() {
    const btnNormal = document.getElementById('btn-sim-normal');
    const btnSpike = document.getElementById('btn-sim-spike');
    const btnOutage = document.getElementById('btn-sim-outage');

    if (btnNormal) btnNormal.addEventListener('click', triggerNormalState);
    if (btnSpike) btnSpike.addEventListener('click', triggerTrafficSpike);
    if (btnOutage) btnOutage.addEventListener('click', triggerOutageAndRCA);

    if (elSlider) {
      elSlider.addEventListener('input', (e) => handleSliderChange(e.target.value));
    }

    // Interactive Node tooltips/clicks
    const nodes = document.querySelectorAll('.arch-node');
    nodes.forEach(node => {
      node.addEventListener('click', () => {
        const service = node.dataset.service;
        const details = node.dataset.details || 'Component active and functioning within SLA parameters.';
        addLog(`Inspecting [${service.toUpperCase()}]: ${details}`, 'info');
      });
    });

    triggerNormalState();

    // Gentle live jitter
    setInterval(() => {
      if (simState.mode === 'normal') {
        const jitter = (Math.random() - 0.5) * 60;
        simState.rps = Math.max(800, Math.round(simState.rps + jitter));
        simState.latency = Math.max(9, Math.min(22, simState.latency + (Math.random() - 0.5) * 1.5));
        updateDisplay();
      }
    }, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
