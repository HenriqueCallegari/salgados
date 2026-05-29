/* =========================================================
   Salgadinho&Cia — Interações avançadas
   (cursor spotlight, parallax, tilt 3D, scroll progress,
    magnetic buttons, partículas)
   ========================================================= */

(() => {
  const isTouch = window.matchMedia('(hover: none)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ SCROLL PROGRESS ============ */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  /* ============ CURSOR SPOTLIGHT ============ */
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorGlow);
  document.body.appendChild(cursorDot);

  let cursorX = 0, cursorY = 0;
  let glowX = 0, glowY = 0, dotX = 0, dotY = 0;

  if (!isTouch && !prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      if (!document.body.classList.contains('cursor-active')) {
        document.body.classList.add('cursor-active');
      }
    });

    window.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-active');
    });

    /* Anima o cursor com lerp para suavidade */
    function animateCursor() {
      glowX += (cursorX - glowX) * 0.12;
      glowY += (cursorY - glowY) * 0.12;
      dotX  += (cursorX - dotX)  * 0.28;
      dotY  += (cursorY - dotY)  * 0.28;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      cursorDot.style.transform  = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    /* Dot expande sobre elementos clicáveis */
    const hoverSel = 'button, a, .product-card, .combo-card, .chip, .payment-option, .contact-card, .nav-links a, .testimonial';
    document.querySelectorAll(hoverSel).forEach((el) => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
    });
  }

  /* ============ SCROLL HANDLER (progress + parallax + scale) ============ */
  const heroImage = document.querySelector('.hero-image');
  const heroBefore = document.querySelector('.hero');
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(100, (scrollTop / docHeight) * 100);
      progressBar.style.width = `${progress}%`;

      /* Parallax leve no hero conforme rola */
      if (heroImage && scrollTop < window.innerHeight) {
        const py = scrollTop * 0.15;
        heroImage.style.transform = `translateY(${py}px)`;
      }

      /* Scale + fade nas seções com .scroll-fade conforme entram/saem da viewport */
      document.querySelectorAll('.scroll-fade').forEach((el) => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - vh / 2);
        const norm = Math.min(1, distance / vh);
        const scale = 1 - norm * 0.06;
        const opacity = 1 - norm * 0.35;
        el.style.setProperty('--scroll-scale', scale.toFixed(3));
        el.style.setProperty('--scroll-opacity', opacity.toFixed(3));
      });

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============ MOUSE PARALLAX NO HERO ============ */
  const heroSection = document.querySelector('.hero');
  const floatBL = document.querySelector('.floating-card.bl');
  const floatTR = document.querySelector('.floating-card.tr');

  if (heroSection && !isTouch && !prefersReducedMotion) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;

      if (heroImage) {
        heroImage.style.transform =
          `perspective(1000px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateZ(0)`;
      }
      if (floatBL) {
        floatBL.style.transform = `translate(${dx * -22}px, ${dy * -22}px)`;
      }
      if (floatTR) {
        floatTR.style.transform = `translate(${dx * 22}px, ${dy * 22}px)`;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      if (heroImage) heroImage.style.transform = '';
      if (floatBL) floatBL.style.transform = '';
      if (floatTR) floatTR.style.transform = '';
    });
  }

  /* ============ TILT 3D NOS CARDS ============ */
  function attachTilt(selector, max = 8) {
    if (isTouch || prefersReducedMotion) return;
    document.querySelectorAll(selector).forEach((card) => {
      card.classList.add('tilt');
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -max;
        const ry = (px - 0.5) * max;
        card.style.transform =
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.015)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* Observa novos cards inseridos (cardápio é renderizado por JS) */
  const tiltObserver = new MutationObserver(() => {
    attachTilt('.product-card:not(.tilt)', 9);
    attachTilt('.combo-card:not(.tilt)', 7);
    attachTilt('.testimonial:not(.tilt)', 6);
  });
  tiltObserver.observe(document.body, { childList: true, subtree: true });
  attachTilt('.product-card', 9);
  attachTilt('.combo-card', 7);
  attachTilt('.testimonial', 6);

  /* ============ MAGNETIC BUTTONS ============ */
  function attachMagnetic(selector, strength = 0.25) {
    if (isTouch || prefersReducedMotion) return;
    document.querySelectorAll(selector).forEach((btn) => {
      btn.classList.add('magnetic');
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * strength;
        const dy = (e.clientY - (r.top + r.height / 2)) * strength;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }
  /* Efeito magnético apenas nos botões pequenos/contidos.
     Removido dos CTAs grandes para não "fugir" do clique de compra. */
  attachMagnetic('.icon-btn', 0.25);
  attachMagnetic('.add-btn', 0.3);

  /* ============ PARTÍCULAS FLUTUANTES ============ */
  if (!prefersReducedMotion) {
    const particles = document.createElement('div');
    particles.className = 'particles';
    document.body.appendChild(particles);

    const count = window.innerWidth < 768 ? 6 : 12;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 5 + Math.random() * 11;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${18 + Math.random() * 18}s`;
      p.style.animationDelay = `${Math.random() * -25}s`;
      p.style.opacity = (0.15 + Math.random() * 0.25).toFixed(2);
      particles.appendChild(p);
    }
  }
})();
