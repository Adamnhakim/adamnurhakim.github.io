/**
 * Main Application Logic for Adam Nur Hakim's Portfolio
 */

(function () {
  'use strict';

  // --- Toast Notifications ---
  function showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${type === 'success' ? '✔' : 'ℹ'}</span>
        <span>${message}</span>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  // --- Theme Toggle (Dark / Light) ---
  function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const savedTheme = localStorage.getItem('anh-theme') || 'dark';

    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      if (themeBtn) themeBtn.innerHTML = '🌙';
    } else {
      document.body.classList.remove('light-theme');
      if (themeBtn) themeBtn.innerHTML = '☀️';
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        localStorage.setItem('anh-theme', isLight ? 'light' : 'dark');
        themeBtn.innerHTML = isLight ? '🌙' : '☀️';
        showToast(`Theme switched to ${isLight ? 'Light' : 'Dark'} Mode`, 'info', 2000);
      });
    }
  }

  // --- Scroll Spy & Header Behavior ---
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('primary-nav');
    const backToTopBtn = document.getElementById('back-to-top');

    // Sticky shadow
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }

      if (backToTopBtn) {
        if (window.scrollY > 500) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }

      // Scroll Spy
      let currentSectionId = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        const height = sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < top + height) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    });

    // Mobile nav toggle
    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        mobileMenuBtn.innerHTML = isOpen ? '✕' : '☰';
      });

      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
          mobileMenuBtn.innerHTML = '☰';
        });
      });
    }

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // --- Animated Stat Counters ---
  function initCounters() {
    const counters = document.querySelectorAll('.counter-val');
    if (!counters.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          counters.forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            const prefix = counter.dataset.prefix || '';
            const suffix = counter.dataset.suffix || '';
            const decimals = parseInt(counter.dataset.decimals || '0', 10);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out quad
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const currentVal = (target * easeOut).toFixed(decimals);

              counter.textContent = `${prefix}${currentVal}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
              }
            }

            requestAnimationFrame(updateCounter);
          });
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) observer.observe(statsSection);
  }

  // --- Experience Timeline Filter ---
  function initExperienceFilter() {
    const filterBtns = document.querySelectorAll('.exp-filter-btn');
    const expItems = document.querySelectorAll('.timeline-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        expItems.forEach(item => {
          const category = item.dataset.category;
          if (filter === 'all' || category.includes(filter)) {
            item.style.display = 'grid';
            item.classList.add('fade-in');
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Skills Matrix & Live Search ---
  function initSkillsFilter() {
    const skillChips = document.querySelectorAll('.skill-tag-filter');
    const skillCards = document.querySelectorAll('.skill-card');
    const searchInput = document.getElementById('skill-search-input');

    function applyFilter() {
      const activeChip = document.querySelector('.skill-tag-filter.active');
      const activeCategory = activeChip ? activeChip.dataset.category : 'all';
      const searchTerm = (searchInput ? searchInput.value : '').toLowerCase().trim();

      skillCards.forEach(card => {
        const cardCategory = card.dataset.category || '';
        const cardText = card.textContent.toLowerCase();

        const matchCat = (activeCategory === 'all' || cardCategory === activeCategory);
        const matchSearch = (!searchTerm || cardText.includes(searchTerm));

        if (matchCat && matchSearch) {
          card.style.display = 'block';
          card.classList.add('fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    }

    skillChips.forEach(chip => {
      chip.addEventListener('click', () => {
        skillChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        applyFilter();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
    }
  }

  // --- RCA Case Study Interactive Tabs ---
  function initRcaTabs() {
    const rcaTabs = document.querySelectorAll('.rca-tab-btn');
    const rcaPanels = document.querySelectorAll('.rca-panel');

    rcaTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        rcaTabs.forEach(t => t.classList.remove('active'));
        rcaPanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.dataset.target;
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // --- Copy Actions & Contact Form ---
  function initContactActions() {
    const copyEmailBtns = document.querySelectorAll('.btn-copy-email');
    const copyPhoneBtns = document.querySelectorAll('.btn-copy-phone');
    const printCvBtns = document.querySelectorAll('.btn-print-cv');

    copyEmailBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const email = 'adamnurhakimwork@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Email copied: ${email}`, 'success');
        }).catch(() => {
          showToast('Could not copy to clipboard', 'warn');
        });
      });
    });

    copyPhoneBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const phone = '085179710822';
        navigator.clipboard.writeText(phone).then(() => {
          showToast(`Phone / WA copied: ${phone}`, 'success');
        }).catch(() => {
          showToast('Could not copy to clipboard', 'warn');
        });
      });
    });

    printCvBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        showToast('Opening print dialog. Tip: Choose "Save as PDF" to download CV', 'info', 4000);
        setTimeout(() => window.print(), 300);
      });
    });

    // Contact Form handling
    const contactForm = document.getElementById('portfolio-contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('cf-name');
        const emailInput = document.getElementById('cf-email');
        const roleInput = document.getElementById('cf-role');
        const msgInput = document.getElementById('cf-message');

        const name = nameInput ? nameInput.value.trim() : 'Recruiter / Peer';
        const senderEmail = emailInput ? emailInput.value.trim() : '';
        const role = roleInput ? roleInput.value : 'Software Engineering Lead Opportunity';
        const msg = msgInput ? msgInput.value.trim() : '';

        if (!senderEmail || !msg) {
          showToast('Please fill out your email and message', 'warn');
          return;
        }

        const mailtoSubject = encodeURIComponent(`[${role}] Inquiry from ${name}`);
        const mailtoBody = encodeURIComponent(
          `Hi Adam,\n\nMy name is ${name} (${senderEmail}).\n\nI am reaching out regarding a ${role} opportunity.\n\nMessage:\n${msg}\n\nBest regards,\n${name}`
        );

        showToast('Launching email client to send message to Adam...', 'success', 3000);
        setTimeout(() => {
          window.location.href = `mailto:adamnurhakimwork@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
        }, 500);
      });
    }
  }

  // --- Initializer ---
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initCounters();
    initExperienceFilter();
    initSkillsFilter();
    initRcaTabs();
    initContactActions();
  });
})();
