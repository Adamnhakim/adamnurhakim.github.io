/**
 * Interactive Terminal CLI for Adam Nur Hakim's Portfolio
 */

(function () {
  const terminalModal = document.getElementById('terminal-modal');
  const terminalBody = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  const openTerminalBtns = document.querySelectorAll('.open-terminal-btn');
  const closeTerminalBtn = document.getElementById('close-terminal-btn');
  const terminalQuickBtns = document.querySelectorAll('.term-quick-btn');

  if (!terminalBody || !terminalInput) return;

  const commandHistory = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: `
<span class="term-cyan">AVAILABLE COMMANDS:</span>
  <span class="term-green">whoami</span>       - Summary of role, title, and vision
  <span class="term-green">skills</span>       - Polyglot languages, frameworks, cloud & DB stack
  <span class="term-green">exp</span>          - Career timeline & leadership roles
  <span class="term-green">arch</span>         - Architectural philosophies & microservices patterns
  <span class="term-green">rca</span>          - Root Cause Analysis & troubleshooting playbook
  <span class="term-green">contact</span>      - Phone, Email, Location & WhatsApp direct
  <span class="term-green">summary</span>      - Full professional summary
  <span class="term-green">print-cv</span>     - Trigger print/export CV dialog
  <span class="term-green">clear</span>        - Clear terminal screen
  <span class="term-green">exit</span>         - Close terminal window
`,
    whoami: `
<span class="term-bold term-white">ADAM NUR HAKIM</span>
<span class="term-cyan">Targeting:</span> Software Engineering Lead / Technical Lead / Solutions Architect
<span class="term-yellow">Location:</span> Jakarta & Bekasi Timur, Indonesia
<span class="term-green">Key Strength:</span> Microservices & Distributed Systems, High Availability, Concurrency, Troubleshooting & RCA.
`,
    summary: `
<span class="term-purple">PROFESSIONAL SUMMARY:</span>
A Bachelor of Information Systems graduate with a strong academic background and extensive experience as a Technical Lead, core programmer, and software architect. Consistently recognized for handling complex troubleshooting, root cause analysis (RCA), and resolving production issues. Proficient in designing system architecture for microservices and distributed systems to ensure high availability, scalability, and reliability. Quick to learn new technologies, equally successful in Agile/Scrum settings, and proficient in a wide range of programming languages, databases, and containerized environments.
`,
    skills: `
<span class="term-cyan">=== TECHNICAL STACK ===</span>
<span class="term-bold term-white">Languages:</span> Go, TypeScript, Node.js, JavaScript, Java, PHP, SQL, C++, HTML/CSS
<span class="term-bold term-white">Frameworks:</span> Spring, Gin, Echo, Laravel, Lumen, Bootstrap, CodeIgniter
<span class="term-bold term-white">Architecture:</span> Microservices, Distributed Systems, System Design, Solution Architecture, ERD, UML
<span class="term-bold term-white">Data & Queues:</span> PostgreSQL, MySQL, Redis, Message Brokers (Queue), Oracle, Firebase, AWS
<span class="term-bold term-white">DevOps & Obs:</span> Docker, Kubernetes (k8s), Grafana, Logging, Monitoring, Git, CI/CD
<span class="term-bold term-white">Practices:</span> Agile, Scrum, Kanban, Automated Testing (Unit/Integration), Code Reviews, RCA
`,
    exp: `
<span class="term-cyan">=== LEADERSHIP & CAREER TRACK ===</span>
• <span class="term-green">Bank Jakarta (under Abishar Technologies)</span> [June 2026 – Present]
  <span class="term-yellow">Squad Lead / Technical Lead</span>: Distributed banking products, microservices, concurrency, Grafana, RCA.
• <span class="term-green">Koltiva AG, Jakarta Selatan</span> [Feb 2023 – June 2026]
  <span class="term-yellow">Lead Software Engineer</span>: FarmCloud architecture, dev team management, Kubernetes, Docker, automated testing.
• <span class="term-green">Koltiva AG</span> [Sept 2021 – Feb 2023]
  <span class="term-yellow">Back End Developer</span>: Redis caching, message brokers, PostgreSQL indexing, payments, security.
• <span class="term-green">PT Agranet Multicitra Siberkom (Detik.com)</span> [Sept 2019 – Sept 2021]
  <span class="term-yellow">Back End Core Developer</span>: High-traffic core APIs, throughput optimization, payment gateways, analytics.
• <span class="term-green">PT Moorne Group (Mayapada Group)</span> [Oct 2018 – Sept 2019]
  <span class="term-yellow">PHP Programmer</span>: Mayapada Fintech, payment gateway APIs, database concepts, dokter.id.
• <span class="term-green">PT Invosa Systems</span> [Apr 2017 – Oct 2018]
  <span class="term-yellow">PHP Programmer</span>: ERP & Human Resource Management Systems.
• <span class="term-green">PT Berita Satu Media Holdings</span> [June 2014 – Apr 2017]
  <span class="term-yellow">Web Programmer</span>: BeritaSatu, JakartaGlobe, SuaraPembaruan, Investor Daily news portals.
• <span class="term-gray">Foundational Engineering Roles</span> [2009 – 2014]: Grand Spot, Fujisei Metal, Andaman Lestari, Telkom Indonesia.
`,
    arch: `
<span class="term-cyan">=== ARCHITECTURAL PRINCIPLES ===</span>
1. <span class="term-white">High Availability & Zero Single Point of Failure:</span> Active-active replicas, circuit breakers, graceful degradation.
2. <span class="term-white">Concurrency & Queue Decoupling:</span> Asynchronous event ingestion via Message Brokers, resilient backpressure.
3. <span class="term-white">Aggressive Caching:</span> Redis cache layer to absorb read spikes (90%+ hit rates) before hitting primary DBs.
4. <span class="term-white">Defense in Depth:</span> Strict token authentication, parametrized queries (SQLi immune), sanitized outputs (XSS immune).
5. <span class="term-white">Observability-First:</span> If it is not monitored, it will fail silently. Grafana dashboards + structured logging.
`,
    rca: `
<span class="term-cyan">=== ROOT CAUSE ANALYSIS (RCA) PLAYBOOK ===</span>
1. <span class="term-yellow">Detection & Triage:</span> P99 latency alerts via Grafana, isolate blast radius.
2. <span class="term-yellow">Mitigation First:</span> Scale pods, apply circuit breaker, or promote standby replica to protect user SLA.
3. <span class="term-yellow">5-Whys Deep Dive:</span> Trace request logs, inspect locks, slow query logs, connection pools.
4. <span class="term-yellow">Permanent Remediation:</span> Refactor query, introduce index, increase pool or queue buffer.
5. <span class="term-yellow">Post-Mortem & Prevention:</span> Document timeline, action items, add automated integration test & alert threshold.
`,
    contact: `
<span class="term-cyan">=== GET IN TOUCH ===</span>
• <span class="term-white">Email:</span> <a href="mailto:adamnurhakimwork@gmail.com" class="term-link">adamnurhakimwork@gmail.com</a>
• <span class="term-white">Phone / WhatsApp:</span> <a href="https://wa.me/6285179710822" target="_blank" class="term-link">085179710822 (+62 851-7971-0822)</a>
• <span class="term-white">Location:</span> Bekasi Timur, Jawa Barat, Indonesia
• <span class="term-white">Certifications:</span> Mozilla JS Foundations (2025), LinkedIn Agile Software Development (2025)
`
  };

  function printLine(html) {
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = html;
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function executeCommand(rawInput) {
    const input = rawInput.trim();
    if (!input) return;

    commandHistory.push(input);
    historyIndex = commandHistory.length;

    // Echo command
    printLine(`<span class="term-prompt">adam@anh-box:~$</span> <span class="term-white">${escapeHtml(input)}</span>`);

    const lower = input.toLowerCase();

    if (lower === 'clear') {
      terminalBody.innerHTML = '';
      return;
    }

    if (lower === 'exit' || lower === 'quit') {
      closeTerminal();
      return;
    }

    if (lower === 'print-cv' || lower.includes('curl') || lower.includes('cv')) {
      printLine('<span class="term-green">Triggering CV Print / PDF Export dialog...</span>');
      window.print();
      return;
    }

    if (lower.startsWith('sudo')) {
      printLine('<span class="term-red">adam is not in the sudoers file. This incident will be reported to Grafana.</span> 😉');
      return;
    }

    if (COMMANDS[lower]) {
      printLine(COMMANDS[lower]);
    } else {
      printLine(`<span class="term-red">command not found: ${escapeHtml(input)}</span>. Type <span class="term-cyan">'help'</span> for list of commands.`);
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function openTerminal() {
    if (terminalModal) {
      terminalModal.classList.add('active');
      terminalModal.setAttribute('aria-hidden', 'false');
      setTimeout(() => terminalInput.focus(), 100);
    }
  }

  function closeTerminal() {
    if (terminalModal) {
      terminalModal.classList.remove('active');
      terminalModal.setAttribute('aria-hidden', 'true');
    }
  }

  // Key listeners
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    } else if (e.key === 'Escape') {
      closeTerminal();
    }
  });

  openTerminalBtns.forEach(btn => btn.addEventListener('click', openTerminal));
  if (closeTerminalBtn) closeTerminalBtn.addEventListener('click', closeTerminal);

  terminalQuickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });

  // Hotkey: Backtick ` or Ctrl+` opens terminal
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      if (terminalModal.classList.contains('active')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    }
  });

  // Welcome message
  printLine(`<span class="term-cyan">Welcome to Adam Nur Hakim's Interactive CLI v2.6.1</span>`);
  printLine(`<span class="term-gray">Type <span class="term-green">'help'</span> or click the buttons below to explore. Press <span class="term-yellow">'Esc'</span> to close.</span>`);
})();
