/* ============================================================
   RADHE INFRASTRUCTURE — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Mobile Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- 2. Sticky Navbar ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const updateNav = () => {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
        navbar.classList.remove('transparent');
      } else {
        navbar.classList.remove('scrolled');
        navbar.classList.add('transparent');
      }
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  /* ---------- 3. Scroll Reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ---------- 4. Animated Counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const step = Math.ceil(target / (duration / 16));
      let current = 0;
      const tick = () => {
        current += step;
        if (current >= target) {
          el.textContent = target + suffix;
          return;
        }
        el.textContent = current + suffix;
        requestAnimationFrame(tick);
      };
      tick();
    };
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObs.observe(el));
  }

  /* ---------- 5. Project Filter ---------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterTabs.length && projectCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        projectCards.forEach(card => {
          const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
          if (filter === 'all' || categories.includes(filter)) {
            card.style.display = '';
            card.style.animation = 'fadeInUp .5s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------- 6. Back to Top ---------- */
  const backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 7. Smooth Scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- 8. Form Validation ---------- */
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e53e3e';
          field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
        }
      });
      // Email validation
      const email = form.querySelector('input[type="email"]');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        valid = false;
        email.style.borderColor = '#e53e3e';
      }
      // Phone validation
      const phone = form.querySelector('input[type="tel"]');
      if (phone && phone.value && !/^[\d+\-\s()]{7,15}$/.test(phone.value)) {
        valid = false;
        phone.style.borderColor = '#e53e3e';
      }
      if (valid) {
        // Show success message
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Submitted Successfully!';
        btn.style.background = '#38a169';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 3000);
      }
    });
  });

  /* ---------- 9. File Upload Label ---------- */
  const fileInputs = document.querySelectorAll('.file-upload input[type="file"]');
  fileInputs.forEach(input => {
    input.addEventListener('change', () => {
      const label = input.closest('.file-upload').querySelector('p');
      if (input.files.length) {
        label.textContent = input.files[0].name;
        label.style.color = '#38a169';
      }
    });
  });

  /* ---------- 10. Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  if (lightbox && lightboxImg) {
    document.querySelectorAll('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        lightboxImg.src = trigger.src || trigger.dataset.lightbox;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- 11. Typing effect for hero ---------- */
  const typeEl = document.querySelector('[data-typing]');
  if (typeEl) {
    const words = JSON.parse(typeEl.dataset.typing);
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const type = () => {
      const word = words[wordIndex];
      if (isDeleting) {
        typeEl.textContent = word.substring(0, charIndex--);
        if (charIndex < 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(type, 400);
          return;
        }
      } else {
        typeEl.textContent = word.substring(0, charIndex++);
        if (charIndex > word.length) {
          isDeleting = true;
          setTimeout(type, 1800);
          return;
        }
      }
      setTimeout(type, isDeleting ? 40 : 80);
    };
    setTimeout(type, 1000);
  }

  /* ---------- 12. Active nav link based on current page ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ---------- 13. Parallax Effect ---------- */
  const parallaxBgs = document.querySelectorAll('.hero-bg');
  if (parallaxBgs.length && !window.matchMedia('(max-width:768px)').matches) {
    window.addEventListener('scroll', () => {
      parallaxBgs.forEach(bg => {
        const speed = 0.4;
        bg.style.transform = `translateY(${window.scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  /* ---------- 14. Autoplay Loop Videos when in view ---------- */
  const loopVideos = document.querySelectorAll('video[autoplay]');
  if (loopVideos.length) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target;
        if (entry.isIntersecting) {
          vid.muted = true;
          const playPromise = vid.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.2 });
    loopVideos.forEach(vid => {
      vid.muted = true;
      videoObserver.observe(vid);
    });
  }

  /* ---------- 15. Radhe Structural Studio (Canvas & Live Estimator) ---------- */
  const canvas = document.getElementById('studioCanvas');
  const archetypeBtns = document.querySelectorAll('.archetype-btn');
  const spanRange = document.getElementById('spanRange');
  const lengthRange = document.getElementById('lengthRange');
  const eaveRange = document.getElementById('eaveRange');
  const craneBtns = document.querySelectorAll('#craneSelector .pill-btn');
  const claddingBtns = document.querySelectorAll('#claddingSelector .pill-btn');

  // Readouts
  const spanValBadge = document.getElementById('spanValBadge');
  const lengthValBadge = document.getElementById('lengthValBadge');
  const eaveValBadge = document.getElementById('eaveValBadge');
  const hudDimSummary = document.getElementById('hudDimSummary');
  const calcArea = document.getElementById('calcArea');
  const calcSteel = document.getElementById('calcSteel');
  const calcDays = document.getElementById('calcDays');
  const btnApplySpecs = document.getElementById('btnApplySpecs');

  // Quote Form elements
  const quoteLength = document.getElementById('quoteLength');
  const quoteWidth = document.getElementById('quoteWidth');
  const quoteHeight = document.getElementById('quoteHeight');
  const quoteNotes = document.getElementById('quoteNotes');
  const configuredSpecsAlert = document.getElementById('configuredSpecsAlert');
  const configuredSpecsSummary = document.getElementById('configuredSpecsSummary');
  const quickQuoteCard = document.getElementById('quickQuoteCard');

  if (canvas && spanRange && lengthRange && eaveRange) {
    let state = {
      type: 'peb', // 'peb' | 'round' | 'crane'
      span: 36,
      length: 75,
      eave: 9.5,
      crane: 10,
      cladding: 'standing-seam'
    };

    const ctx = canvas.getContext('2d');

    // Handle high DPI
    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.resetTransform && ctx.resetTransform();
      ctx.scale(dpr, dpr);
      render();
    };

    window.addEventListener('resize', resizeCanvas);

    // Render Canvas
    const render = () => {
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Margin & scale
      const marginX = 80;
      const groundY = h - 65;
      const availableW = w - marginX * 2;
      const availableH = groundY - 70;

      // Scale factor mapping span (15-60m) and height (6-18m)
      const scaleX = (availableW * 0.85) / 60;
      const scaleY = (availableH * 0.88) / 18;

      const frameWidth = state.span * scaleX;
      const frameHeight = state.eave * scaleY;
      const apexExtra = state.type === 'round' ? (state.span * 0.22) * scaleY : (state.span * 0.1) * scaleY;
      const totalHeight = frameHeight + apexExtra;

      const startX = (w - frameWidth) / 2;
      const endX = startX + frameWidth;
      const midX = startX + frameWidth / 2;
      const eaveY = groundY - frameHeight;
      const apexY = groundY - totalHeight;

      // Ground Line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(25, groundY);
      ctx.lineTo(w - 25, groundY);
      ctx.stroke();

      // Ground soil hatching
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 35; x < w - 35; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x - 12, groundY + 14);
        ctx.stroke();
      }

      // Concrete Pedestals & Base Plates
      const pedW = 28;
      const pedH = 16;
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;

      // Left Pedestal
      ctx.fillRect(startX - pedW / 2, groundY, pedW, pedH);
      ctx.strokeRect(startX - pedW / 2, groundY, pedW, pedH);
      // Right Pedestal
      ctx.fillRect(endX - pedW / 2, groundY, pedW, pedH);
      ctx.strokeRect(endX - pedW / 2, groundY, pedW, pedH);

      // Base plate bolts
      ctx.fillStyle = '#d4a853';
      ctx.beginPath();
      ctx.arc(startX - 6, groundY + 2, 2.5, 0, Math.PI * 2);
      ctx.arc(startX + 6, groundY + 2, 2.5, 0, Math.PI * 2);
      ctx.arc(endX - 6, groundY + 2, 2.5, 0, Math.PI * 2);
      ctx.arc(endX + 6, groundY + 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Structural Columns & Rafters
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      if (state.type === 'round') {
        // --- Curved Round Roof (Truss Arch like Keshar / Panoli) ---
        ctx.beginPath();
        ctx.moveTo(startX, groundY);
        ctx.lineTo(startX, eaveY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(endX, groundY);
        ctx.lineTo(endX, eaveY);
        ctx.stroke();

        // Top curved chord
        ctx.beginPath();
        ctx.moveTo(startX, eaveY);
        ctx.quadraticCurveTo(midX, apexY - 6, endX, eaveY);
        ctx.stroke();

        // Bottom curved tie chord
        const tieOffset = 18;
        ctx.beginPath();
        ctx.moveTo(startX, eaveY + tieOffset * 0.4);
        ctx.quadraticCurveTo(midX, apexY + tieOffset, endX, eaveY + tieOffset * 0.4);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.stroke();

        // Truss web lattice (diagonal struts)
        ctx.strokeStyle = 'rgba(212, 168, 83, 0.55)';
        ctx.lineWidth = 1.2;
        const webSteps = 14;
        for (let i = 1; i < webSteps; i++) {
          const t = i / webSteps;
          const topX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
          const topY = (1 - t) * (1 - t) * eaveY + 2 * (1 - t) * t * (apexY - 6) + t * t * eaveY;
          const botY = (1 - t) * (1 - t) * (eaveY + tieOffset * 0.4) + 2 * (1 - t) * t * (apexY + tieOffset) + t * t * (eaveY + tieOffset * 0.4);

          ctx.beginPath();
          ctx.moveTo(topX, topY);
          ctx.lineTo(topX + (i % 2 === 0 ? 8 : -8), botY);
          ctx.stroke();
        }
      } else {
        // --- PEB / Heavy Crane Rigid Portal Frame (Tapered) ---
        const haunchDepth = 16;
        const apexDepth = 8;

        // Left Tapered Column
        ctx.beginPath();
        ctx.moveTo(startX - 4, groundY);
        ctx.lineTo(startX - haunchDepth, eaveY);
        ctx.lineTo(startX, eaveY);
        ctx.lineTo(startX + 4, groundY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
        ctx.fill();
        ctx.stroke();

        // Right Tapered Column
        ctx.beginPath();
        ctx.moveTo(endX + 4, groundY);
        ctx.lineTo(endX + haunchDepth, eaveY);
        ctx.lineTo(endX, eaveY);
        ctx.lineTo(endX - 4, groundY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
        ctx.fill();
        ctx.stroke();

        // Left Rafter
        ctx.beginPath();
        ctx.moveTo(startX - haunchDepth, eaveY);
        ctx.lineTo(midX, apexY);
        ctx.lineTo(midX, apexY + apexDepth);
        ctx.lineTo(startX, eaveY + haunchDepth);
        ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.fill();
        ctx.stroke();

        // Right Rafter
        ctx.beginPath();
        ctx.moveTo(endX + haunchDepth, eaveY);
        ctx.lineTo(midX, apexY);
        ctx.lineTo(midX, apexY + apexDepth);
        ctx.lineTo(endX, eaveY + haunchDepth);
        ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.fill();
        ctx.stroke();

        // Purlin clips / cleats on roof
        ctx.fillStyle = '#d4a853';
        const numPurlins = 6;
        for (let i = 1; i <= numPurlins; i++) {
          const ratio = i / (numPurlins + 1);
          const pxL = (startX - haunchDepth) + ((midX - (startX - haunchDepth)) * ratio);
          const pyL = eaveY + ((apexY - eaveY) * ratio);
          ctx.fillRect(pxL - 2, pyL - 5, 4, 5);

          const pxR = (endX + haunchDepth) - (((endX + haunchDepth) - midX) * ratio);
          const pyR = eaveY + ((apexY - eaveY) * ratio);
          ctx.fillRect(pxR - 2, pyR - 5, 4, 5);
        }
      }

      // Overhead Crane & Gantry Girder (if crane > 0)
      if (state.crane > 0) {
        const craneBracketY = groundY - (frameHeight * 0.65);
        const bracketW = 20;

        // Left Crane Bracket & Runway
        ctx.fillStyle = '#eab308';
        ctx.fillRect(startX + 4, craneBracketY, bracketW, 8);
        // Right Crane Bracket & Runway
        ctx.fillRect(endX - 4 - bracketW, craneBracketY, bracketW, 8);

        // Crane Bridge Beam
        const bridgeX1 = startX + 4 + bracketW;
        const bridgeX2 = endX - 4 - bracketW;
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(bridgeX1, craneBracketY + 3);
        ctx.lineTo(bridgeX2, craneBracketY + 3);
        ctx.stroke();

        // Crane Trolley & Hoist Hook
        const trolleyX = midX - 30;
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(trolleyX - 10, craneBracketY - 4, 20, 8);

        // Cable & Hook
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(trolleyX, craneBracketY + 4);
        ctx.lineTo(trolleyX, craneBracketY + 22);
        ctx.stroke();

        // Hook
        ctx.strokeStyle = '#d4a853';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(trolleyX, craneBracketY + 26, 4, 0, Math.PI);
        ctx.stroke();

        // Crane Load Label
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`EOT CRANE ${state.crane} MT`, bridgeX1 + 10, craneBracketY - 6);
      }

      // Moment Connection Pulse Nodes
      const pulseNodes = [
        { x: startX, y: eaveY },
        { x: endX, y: eaveY },
        { x: midX, y: apexY }
      ];
      pulseNodes.forEach(node => {
        ctx.fillStyle = '#d4a853';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(212, 168, 83, 0.4)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Dimension Lines & Callouts
      // 1. Span Dimension (Bottom)
      const dimY = groundY + 40;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, dimY);
      ctx.lineTo(endX, dimY);
      ctx.moveTo(startX, dimY - 4); ctx.lineTo(startX, dimY + 4);
      ctx.moveTo(endX, dimY - 4); ctx.lineTo(endX, dimY + 4);
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`<--- ${state.span.toFixed(1)}m CLEAR SPAN (${Math.round(state.span * 3.28084)} ft) --->`, midX, dimY - 6);

      // 2. Eave Height Dimension (Left)
      const dimX = startX - 38;
      ctx.beginPath();
      ctx.moveTo(dimX, groundY);
      ctx.lineTo(dimX, eaveY);
      ctx.moveTo(dimX - 4, groundY); ctx.lineTo(dimX + 4, groundY);
      ctx.moveTo(dimX - 4, eaveY); ctx.lineTo(dimX + 4, eaveY);
      ctx.stroke();

      ctx.save();
      ctx.translate(dimX - 8, (groundY + eaveY) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`${state.eave.toFixed(1)}m EAVE`, 0, 0);
      ctx.restore();

      // 3. Apex Height Dimension (Right)
      const apexDimX = endX + 38;
      ctx.beginPath();
      ctx.moveTo(apexDimX, groundY);
      ctx.lineTo(apexDimX, apexY);
      ctx.moveTo(apexDimX - 4, groundY); ctx.lineTo(apexDimX + 4, groundY);
      ctx.moveTo(apexDimX - 4, apexY); ctx.lineTo(apexDimX + 4, apexY);
      ctx.stroke();

      const apexM = (state.eave + (state.type === 'round' ? state.span * 0.22 : state.span * 0.1)).toFixed(1);
      ctx.save();
      ctx.translate(apexDimX + 16, (groundY + apexY) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`${apexM}m APEX`, 0, 0);
      ctx.restore();
    };

    // Calculation & UI Update
    const updateCalculations = () => {
      const areaM2 = state.span * state.length;
      const areaSqFt = areaM2 * 10.7639;

      let baseKg = 28 + (state.span / 60) * 18 + (state.eave / 14) * 8;
      if (state.type === 'round') baseKg *= 0.92;
      if (state.type === 'crane') baseKg *= 1.12;

      const craneKg = state.crane === 50 ? 24 : state.crane === 25 ? 15 : state.crane === 10 ? 8 : 0;
      const steelMT = (areaM2 * (baseKg + craneKg)) / 1000;
      const days = Math.max(25, Math.round(20 + (areaM2 / 120) + (state.crane > 0 ? 10 : 0)));

      // Update text badges
      spanValBadge.innerHTML = `${state.span.toFixed(1)} m <small>(${Math.round(state.span * 3.28084)} ft)</small>`;
      lengthValBadge.innerHTML = `${state.length.toFixed(1)} m <small>(${Math.round(state.length * 3.28084)} ft)</small>`;
      eaveValBadge.innerHTML = `${state.eave.toFixed(1)} m <small>(${Math.round(state.eave * 3.28084)} ft)</small>`;
      hudDimSummary.textContent = `${state.span.toFixed(1)}m × ${state.length.toFixed(1)}m × ${state.eave.toFixed(1)}m`;

      // Update KPI metrics
      calcArea.textContent = Math.round(areaSqFt).toLocaleString();
      calcSteel.textContent = `~${Math.round(steelMT)}`;
      calcDays.textContent = `~${days}`;

      // Update quote form fields in real-time
      if (quoteLength) quoteLength.value = state.length;
      if (quoteWidth) quoteWidth.value = state.span;
      if (quoteHeight) quoteHeight.value = state.eave;

      const typeName = state.type === 'peb' ? 'Pre-Engineered Building (PEB)' :
                       state.type === 'round' ? 'Conventional Curved Round Shed' : 'Heavy Crane Workshop';
      const summaryText = `${typeName} | ${state.span}m × ${state.length}m × ${state.eave}m | Crane: ${state.crane} MT | Est: ${Math.round(steelMT)} MT Steel | Area: ${Math.round(areaSqFt).toLocaleString()} Sq.Ft.`;

      if (quoteNotes) quoteNotes.value = summaryText;
      if (configuredSpecsSummary) configuredSpecsSummary.textContent = `${state.span}m × ${state.length}m ${typeName.split(' ')[0]} | Est. ${Math.round(steelMT)} MT Steel`;

      render();
    };

    // Event Listeners for Controls
    archetypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        archetypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.type = btn.dataset.type;
        if (state.type === 'crane' && state.crane === 0) {
          state.crane = 25;
          craneBtns.forEach(b => b.classList.toggle('active', b.dataset.crane === '25'));
        }
        updateCalculations();
      });
    });

    spanRange.addEventListener('input', (e) => {
      state.span = parseFloat(e.target.value);
      updateCalculations();
    });

    lengthRange.addEventListener('input', (e) => {
      state.length = parseFloat(e.target.value);
      updateCalculations();
    });

    eaveRange.addEventListener('input', (e) => {
      state.eave = parseFloat(e.target.value);
      updateCalculations();
    });

    craneBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        craneBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.crane = parseInt(btn.dataset.crane, 10);
        updateCalculations();
      });
    });

    claddingBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        claddingBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.cladding = btn.dataset.cladding;
        updateCalculations();
      });
    });

    // Apply Specs Button (Smooth scroll & highlight form)
    if (btnApplySpecs && quoteLength) {
      btnApplySpecs.addEventListener('click', () => {
        if (configuredSpecsAlert) configuredSpecsAlert.style.display = 'flex';
        const quoteSec = document.getElementById('quoteSection');
        if (quoteSec) {
          quoteSec.scrollIntoView({ behavior: 'smooth' });
        }
        if (quickQuoteCard) {
          quickQuoteCard.classList.remove('form-highlight-pulse');
          void quickQuoteCard.offsetWidth; // trigger reflow
          quickQuoteCard.classList.add('form-highlight-pulse');
        }
      });
    }

    // Initialize
    setTimeout(resizeCanvas, 150);
    updateCalculations();
  }

});
