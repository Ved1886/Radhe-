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

});
