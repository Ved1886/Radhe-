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

  /* Animated Caliber Gauges */
  const caliberGauges = document.querySelectorAll('[data-gauge]');
  if (caliberGauges.length) {
    const gaugeObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetWidth = entry.target.dataset.gauge + '%';
          setTimeout(() => {
            entry.target.style.width = targetWidth;
          }, 200);
          gaugeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    caliberGauges.forEach(el => gaugeObs.observe(el));
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

  /* ---------- 14. Autoplay Loop Videos (Muted, No Controls) ---------- */
  const siteVideos = document.querySelectorAll('video');
  if (siteVideos.length) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target;
        if (entry.isIntersecting) {
          vid.muted = true;
          vid.volume = 0;
          const playPromise = vid.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.15 });

    siteVideos.forEach(vid => {
      vid.muted = true;
      vid.defaultMuted = true;
      vid.volume = 0;
      vid.removeAttribute('controls');
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
  const calcAreaM2 = document.getElementById('calcAreaM2');
  const calcSteel = document.getElementById('calcSteel');
  const calcDays = document.getElementById('calcDays');
  const btnApplySpecs = document.getElementById('btnApplySpecs');
  const btnExportBlueprint = document.getElementById('btnExportBlueprint');
  const btnResetStudio = document.getElementById('btnResetStudio');
  const hudModeBtns = document.querySelectorAll('.hud-mode-btn');

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
      mode: '2d', // '2d' | '3d'
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

    // ==========================================
    // 2D ELEVATION RENDERER
    // ==========================================
    const render2D = (w, h) => {
      // Margin & scale
      const marginX = 85;
      const groundY = h - 65;
      const availableW = w - marginX * 2;
      const availableH = groundY - 70;

      // Scale factors
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

      // Title & Standard Watermark
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('> RADHE CAD ELEVATION: IS 800:2007 (LSM) PORTAL FRAME', 16, 22);

      // Ground Line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
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
      const pedW = 32;
      const pedH = 18;
      ctx.fillStyle = '#111e33';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;

      // Left Pedestal
      ctx.fillRect(startX - pedW / 2, groundY, pedW, pedH);
      ctx.strokeRect(startX - pedW / 2, groundY, pedW, pedH);
      // Right Pedestal
      ctx.fillRect(endX - pedW / 2, groundY, pedW, pedH);
      ctx.strokeRect(endX - pedW / 2, groundY, pedW, pedH);

      // Base plate steel slab & anchor bolts
      ctx.fillStyle = '#d4a853';
      ctx.fillRect(startX - 14, groundY - 3, 28, 4);
      ctx.fillRect(endX - 14, groundY - 3, 28, 4);
      ctx.beginPath();
      ctx.arc(startX - 8, groundY + 5, 2.5, 0, Math.PI * 2);
      ctx.arc(startX + 8, groundY + 5, 2.5, 0, Math.PI * 2);
      ctx.arc(endX - 8, groundY + 5, 2.5, 0, Math.PI * 2);
      ctx.arc(endX + 8, groundY + 5, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Structural Columns & Rafters
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      if (state.type === 'round') {
        // --- Curved Round Roof (Truss Arch) ---
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
        ctx.quadraticCurveTo(midX, apexY - 8, endX, eaveY);
        ctx.stroke();

        // Bottom curved tie chord
        const tieOffset = 18;
        ctx.beginPath();
        ctx.moveTo(startX, eaveY + tieOffset * 0.4);
        ctx.quadraticCurveTo(midX, apexY + tieOffset, endX, eaveY + tieOffset * 0.4);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.stroke();

        // Truss web lattice
        ctx.strokeStyle = 'rgba(212, 168, 83, 0.6)';
        ctx.lineWidth = 1.2;
        const webSteps = 16;
        for (let i = 1; i < webSteps; i++) {
          const t = i / webSteps;
          const topX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
          const topY = (1 - t) * (1 - t) * eaveY + 2 * (1 - t) * t * (apexY - 8) + t * t * eaveY;
          const botY = (1 - t) * (1 - t) * (eaveY + tieOffset * 0.4) + 2 * (1 - t) * t * (apexY + tieOffset) + t * t * (eaveY + tieOffset * 0.4);

          ctx.beginPath();
          ctx.moveTo(topX, topY);
          ctx.lineTo(topX + (i % 2 === 0 ? 9 : -9), botY);
          ctx.stroke();
        }
      } else {
        // --- PEB / Heavy Crane Rigid Portal Frame (Tapered) ---
        const haunchDepth = 16;
        const apexDepth = 9;

        // Left Tapered Column
        ctx.beginPath();
        ctx.moveTo(startX - 4, groundY - 3);
        ctx.lineTo(startX - haunchDepth, eaveY);
        ctx.lineTo(startX, eaveY);
        ctx.lineTo(startX + 4, groundY - 3);
        ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.fill();
        ctx.stroke();

        // Right Tapered Column
        ctx.beginPath();
        ctx.moveTo(endX + 4, groundY - 3);
        ctx.lineTo(endX + haunchDepth, eaveY);
        ctx.lineTo(endX, eaveY);
        ctx.lineTo(endX - 4, groundY - 3);
        ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.fill();
        ctx.stroke();

        // Left Rafter
        ctx.beginPath();
        ctx.moveTo(startX - haunchDepth, eaveY);
        ctx.lineTo(midX, apexY);
        ctx.lineTo(midX, apexY + apexDepth);
        ctx.lineTo(startX, eaveY + haunchDepth);
        ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
        ctx.fill();
        ctx.stroke();

        // Right Rafter
        ctx.beginPath();
        ctx.moveTo(endX + haunchDepth, eaveY);
        ctx.lineTo(midX, apexY);
        ctx.lineTo(midX, apexY + apexDepth);
        ctx.lineTo(endX, eaveY + haunchDepth);
        ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
        ctx.fill();
        ctx.stroke();

        // Apex Splice Plate
        ctx.strokeStyle = '#d4a853';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(midX, apexY - 2);
        ctx.lineTo(midX, apexY + apexDepth + 2);
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
        const trolleyX = midX - 25;
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(trolleyX - 12, craneBracketY - 4, 24, 8);

        // Cable & Hook
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(trolleyX, craneBracketY + 4);
        ctx.lineTo(trolleyX, craneBracketY + 24);
        ctx.stroke();

        // Hook
        ctx.strokeStyle = '#d4a853';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(trolleyX, craneBracketY + 28, 4.5, 0, Math.PI);
        ctx.stroke();

        // Crane Load Label
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'left';
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
        ctx.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(212, 168, 83, 0.4)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 9, 0, Math.PI * 2);
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

    // ==========================================
    // 3D AXONOMETRIC BIM WIREFRAME RENDERER
    // ==========================================
    const render3D = (w, h) => {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('> RADHE 3D AXONOMETRIC BIM WIREFRAME [ISOMETRIC PROJECTION]', 16, 22);

      const centerX = w * 0.5;
      const centerY = h * 0.65;
      const scale = Math.min(w / 140, h / 75);

      const iso = (x, y, z) => {
        // x: width (-span/2 to +span/2)
        // y: height (0 ground upward)
        // z: length (0 to length)
        const cos30 = 0.866;
        const sin30 = 0.5;
        const px = centerX + (x * cos30 - (z - state.length * 0.5) * cos30) * scale * 0.7;
        const py = centerY - (y * scale * 0.9) + (x * sin30 + (z - state.length * 0.5) * sin30) * scale * 0.45;
        return { x: px, y: py };
      };

      const halfSpan = state.span * 0.5;
      const apexExtra = state.type === 'round' ? state.span * 0.22 : state.span * 0.1;
      const apexH = state.eave + apexExtra;
      const numBays = Math.min(10, Math.max(4, Math.round(state.length / 9)));

      // Draw ground foundation slab
      const slab0 = iso(-halfSpan - 1, 0, 0);
      const slab1 = iso(halfSpan + 1, 0, 0);
      const slab2 = iso(halfSpan + 1, 0, state.length);
      const slab3 = iso(-halfSpan - 1, 0, state.length);

      ctx.fillStyle = 'rgba(15, 28, 50, 0.6)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(slab0.x, slab0.y);
      ctx.lineTo(slab1.x, slab1.y);
      ctx.lineTo(slab2.x, slab2.y);
      ctx.lineTo(slab3.x, slab3.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw all portal frames from back to front
      const framePoints = [];
      for (let b = 0; b <= numBays; b++) {
        const z = (b / numBays) * state.length;
        const colL = iso(-halfSpan, 0, z);
        const eaveL = iso(-halfSpan, state.eave, z);
        const apexP = iso(0, apexH, z);
        const eaveR = iso(halfSpan, state.eave, z);
        const colR = iso(halfSpan, 0, z);

        framePoints.push({ colL, eaveL, apexP, eaveR, colR, z });

        const isGable = (b === 0 || b === numBays);
        ctx.strokeStyle = isGable ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = isGable ? 2 : 1.2;

        ctx.beginPath();
        ctx.moveTo(colL.x, colL.y);
        ctx.lineTo(eaveL.x, eaveL.y);
        ctx.lineTo(apexP.x, apexP.y);
        ctx.lineTo(eaveR.x, eaveR.y);
        ctx.lineTo(colR.x, colR.y);
        ctx.stroke();

        // Pedestal dots
        ctx.fillStyle = '#d4a853';
        ctx.beginPath();
        ctx.arc(colL.x, colL.y, 2.5, 0, Math.PI * 2);
        ctx.arc(colR.x, colR.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Longitudinal Connecting Lines (Purlins, Ridge, Eaves)
      // 1. Ridge Beam
      ctx.strokeStyle = '#d4a853';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(framePoints[0].apexP.x, framePoints[0].apexP.y);
      for (let b = 1; b <= numBays; b++) {
        ctx.lineTo(framePoints[b].apexP.x, framePoints[b].apexP.y);
      }
      ctx.stroke();

      // 2. Left & Right Eave Struts
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(framePoints[0].eaveL.x, framePoints[0].eaveL.y);
      for (let b = 1; b <= numBays; b++) {
        ctx.lineTo(framePoints[b].eaveL.x, framePoints[b].eaveL.y);
      }
      ctx.moveTo(framePoints[0].eaveR.x, framePoints[0].eaveR.y);
      for (let b = 1; b <= numBays; b++) {
        ctx.lineTo(framePoints[b].eaveR.x, framePoints[b].eaveR.y);
      }
      ctx.stroke();

      // 3. Intermediate Roof Purlins
      ctx.strokeStyle = 'rgba(212, 168, 83, 0.35)';
      ctx.lineWidth = 1;
      [0.33, 0.66].forEach(ratio => {
        ctx.beginPath();
        for (let b = 0; b <= numBays; b++) {
          const z = (b / numBays) * state.length;
          const pL = iso(-halfSpan + halfSpan * ratio, state.eave + apexExtra * ratio, z);
          if (b === 0) ctx.moveTo(pL.x, pL.y);
          else ctx.lineTo(pL.x, pL.y);
        }
        ctx.stroke();

        ctx.beginPath();
        for (let b = 0; b <= numBays; b++) {
          const z = (b / numBays) * state.length;
          const pR = iso(halfSpan - halfSpan * ratio, state.eave + apexExtra * ratio, z);
          if (b === 0) ctx.moveTo(pR.x, pR.y);
          else ctx.lineTo(pR.x, pR.y);
        }
        ctx.stroke();
      });

      // 4. Crane Runway Girder in 3D (if crane > 0)
      if (state.crane > 0) {
        const craneH = state.eave * 0.65;
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2.5;

        // Left crane runway
        ctx.beginPath();
        for (let b = 0; b <= numBays; b++) {
          const z = (b / numBays) * state.length;
          const cpL = iso(-halfSpan + 1.2, craneH, z);
          if (b === 0) ctx.moveTo(cpL.x, cpL.y);
          else ctx.lineTo(cpL.x, cpL.y);
        }
        ctx.stroke();

        // Right crane runway
        ctx.beginPath();
        for (let b = 0; b <= numBays; b++) {
          const z = (b / numBays) * state.length;
          const cpR = iso(halfSpan - 1.2, craneH, z);
          if (b === 0) ctx.moveTo(cpR.x, cpR.y);
          else ctx.lineTo(cpR.x, cpR.y);
        }
        ctx.stroke();
      }

      // 5. Portal End-Bay X-Bracing
      ctx.strokeStyle = 'rgba(212, 168, 83, 0.5)';
      ctx.lineWidth = 1;
      const b0 = framePoints[0];
      const b1 = framePoints[1];
      ctx.beginPath();
      // Left wall X-brace
      ctx.moveTo(b0.colL.x, b0.colL.y); ctx.lineTo(b1.eaveL.x, b1.eaveL.y);
      ctx.moveTo(b1.colL.x, b1.colL.y); ctx.lineTo(b0.eaveL.x, b0.eaveL.y);
      // Right wall X-brace
      ctx.moveTo(b0.colR.x, b0.colR.y); ctx.lineTo(b1.eaveR.x, b1.eaveR.y);
      ctx.moveTo(b1.colR.x, b1.colR.y); ctx.lineTo(b0.eaveR.x, b0.eaveR.y);
      // Roof X-brace left
      ctx.moveTo(b0.eaveL.x, b0.eaveL.y); ctx.lineTo(b1.apexP.x, b1.apexP.y);
      ctx.moveTo(b1.eaveL.x, b1.eaveL.y); ctx.lineTo(b0.apexP.x, b0.apexP.y);
      ctx.stroke();

      // 3D Dimension Annotation Labels
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      const frontCenter = iso(0, -1, 0);
      ctx.fillText(`SPAN: ${state.span.toFixed(1)}m`, frontCenter.x, frontCenter.y + 12);

      const sideCenter = iso(halfSpan + 3, -1, state.length * 0.5);
      ctx.fillText(`LENGTH: ${state.length.toFixed(1)}m (${numBays} BAYS)`, sideCenter.x, sideCenter.y + 12);

      // Coordinate Axis Gizmo in bottom left
      const gizmoX = 42;
      const gizmoY = h - 35;
      ctx.lineWidth = 2;
      // X axis (Span)
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath(); ctx.moveTo(gizmoX, gizmoY); ctx.lineTo(gizmoX + 22, gizmoY + 8); ctx.stroke();
      ctx.fillStyle = '#ef4444'; ctx.font = 'bold 8px monospace'; ctx.fillText('X', gizmoX + 26, gizmoY + 11);
      // Y axis (Height)
      ctx.strokeStyle = '#22c55e';
      ctx.beginPath(); ctx.moveTo(gizmoX, gizmoY); ctx.lineTo(gizmoX, gizmoY - 22); ctx.stroke();
      ctx.fillStyle = '#22c55e'; ctx.fillText('Y', gizmoX - 2, gizmoY - 25);
      // Z axis (Length)
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath(); ctx.moveTo(gizmoX, gizmoY); ctx.lineTo(gizmoX - 20, gizmoY + 8); ctx.stroke();
      ctx.fillStyle = '#38bdf8'; ctx.fillText('Z', gizmoX - 24, gizmoY + 11);
    };

    // Master Render Dispatcher
    const render = () => {
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      ctx.clearRect(0, 0, w, h);

      if (state.mode === '3d') {
        render3D(w, h);
      } else {
        render2D(w, h);
      }
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
      if (calcAreaM2) calcAreaM2.textContent = `~${Math.round(areaM2).toLocaleString()} m² Ground Area`;
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

    // Viewport HUD Mode Selector (2D Section vs 3D Axonometric BIM)
    hudModeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        hudModeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.mode = btn.dataset.mode || '2d';
        render();
      });
    });

    // Blueprint PNG Export
    if (btnExportBlueprint) {
      btnExportBlueprint.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `radhe-structural-blueprint-${state.type}-${state.span}x${state.length}m-${state.mode}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    // Reset Studio Configuration
    if (btnResetStudio) {
      btnResetStudio.addEventListener('click', () => {
        state = {
          type: 'peb',
          mode: '2d',
          span: 36,
          length: 75,
          eave: 9.5,
          crane: 10,
          cladding: 'standing-seam'
        };

        spanRange.value = 36;
        lengthRange.value = 75;
        eaveRange.value = 9.5;

        archetypeBtns.forEach(b => b.classList.toggle('active', b.dataset.type === 'peb'));
        craneBtns.forEach(b => b.classList.toggle('active', b.dataset.crane === '10'));
        claddingBtns.forEach(b => b.classList.toggle('active', b.dataset.cladding === 'standing-seam'));
        hudModeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === '2d'));

        updateCalculations();
      });
    }

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
