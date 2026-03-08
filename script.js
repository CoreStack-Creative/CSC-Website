/* =============================================================================
   CORESTACK CREATIVE — MAIN SCRIPT
   =============================================================================
   Table of Contents:
   1.  Header hide/show on scroll
   2.  Mobile Navigation
   3.  Scroll reveal animations
   4.  Home page map embed (expand/collapse)
   5.  Hero floating layers (parallax mouse effect)
   6.  Pricing animations (particles, card tilt, sparkles, ripple)
   7.  Price counter animation
   8.  Pricing scroll bar grow/shrink
   9.  Pricing mobile carousel
   10. Portfolio lightbox
   ============================================================================= */


/* =============================================================================
   1. HEADER — HIDE ON SCROLL DOWN, SHOW ON SCROLL UP
   ============================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  let lastScrollY = window.scrollY;
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Ignore tiny jitter
    if (Math.abs(currentScrollY - lastScrollY) < 5) return;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down → hide header
      header.classList.add('hidden');
      header.classList.remove('faded');
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up → reveal header
      header.classList.remove('hidden');
      header.classList.toggle('faded', currentScrollY > 50);
    }

    lastScrollY = currentScrollY;
  });
});


/* =============================================================================
   2. MOBILE NAVIGATION
   ============================================================================= */

class MobileNavigation {
  constructor() {
    this.hamburger = document.getElementById('hamburger');
    this.mobileNav = document.getElementById('mobileNav');
    if (this.hamburger && this.mobileNav) this._bindEvents();
  }

  _bindEvents() {
    // Toggle on hamburger click
    this.hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      this.isOpen() ? this.close() : this.open();
    });

    // Close when a nav link is tapped
    this.mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.close());
    });

    // Close when tapping outside the menu
    document.addEventListener('click', (e) => {
      if (this.isOpen() &&
          !this.mobileNav.contains(e.target) &&
          !this.hamburger.contains(e.target)) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) this.close();
    });

    // Close if viewport grows past mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen()) this.close();
    });
  }

  open() {
    this.hamburger.classList.add('active');
    this.mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.hamburger.classList.remove('active');
    this.mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  }

  isOpen() {
    return this.mobileNav.classList.contains('active');
  }
}

document.addEventListener('DOMContentLoaded', () => new MobileNavigation());


/* =============================================================================
   3. SCROLL REVEAL ANIMATIONS
   ============================================================================= */

// Generic .reveal-up elements (used on home page steps section)
(function initRevealUp() {
  const reveals = document.querySelectorAll('.reveal-up');
  if (!reveals.length) return;

  function checkReveal() {
    const windowHeight = window.innerHeight;
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < windowHeight - 150) {
        el.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', checkReveal);
  window.addEventListener('load', checkReveal);
})();

// .step-box elements (staggered entrance)
(function initStepBoxReveal() {
  const stepBoxes = document.querySelectorAll('.step-box');
  if (!stepBoxes.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 200);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  stepBoxes.forEach(box => observer.observe(box));
})();

// .fade-in-section elements (used on About page)
(function initFadeInSections() {
  const faders = document.querySelectorAll('.fade-in-section');
  if (!faders.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  faders.forEach(el => observer.observe(el));
})();

// .note-card bulletin board tack-in animation
(function initNoteCards() {
  const notes = document.querySelectorAll('.note-card');
  if (!notes.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${i * 500}ms`;
        entry.target.classList.add('tack-in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  notes.forEach(note => observer.observe(note));
})();


/* =============================================================================
   4. HOME PAGE MAP EMBED — EXPAND / COLLAPSE
   ============================================================================= */

(function initMapEmbed() {
  const mapEmbed  = document.getElementById('mapEmbed');
  const closeBtn  = document.getElementById('closeMapBtn');
  if (!mapEmbed || !closeBtn) return;

  function openMap()  { mapEmbed.classList.add('active');    document.body.classList.add('map-open'); }
  function closeMap() { mapEmbed.classList.remove('active'); document.body.classList.remove('map-open'); }

  // Click on collapsed map → expand
  mapEmbed.addEventListener('click', (e) => {
    if (!mapEmbed.classList.contains('active')) {
      e.stopPropagation();
      openMap();
    }
  });

  // Close button
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeMap(); });

  // Click outside expanded map → close
  document.addEventListener('click', (e) => {
    if (mapEmbed.classList.contains('active') && !mapEmbed.contains(e.target)) closeMap();
  });
})();


/* =============================================================================
   5. HERO FLOATING LAYERS — PARALLAX MOUSE EFFECT
   ============================================================================= */

(function initHeroParallax() {
  const heroSection   = document.querySelector('.hero-section');
  const floatingLayers = document.querySelector('.floating-layers');
  if (!floatingLayers) return;

  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;
  let centerX = mouseX;
  let centerY = mouseY;
  let isInside = false;

  // Smoothed values
  let curTiltX = 0, curTiltY = 0, curX = 0, curY = 0;
  const MAX_TILT = 12, MAX_MOVE = 15, SMOOTHING = 0.08;

  // FPS cap
  let lastTime = 0;
  const FRAME_TIME = 1000 / 60;

  function animate(now) {
    if (now - lastTime >= FRAME_TIME) {
      lastTime = now;

      let tX = 0, tY = 0, mX = 0, mY = 0;

      if (isInside) {
        const nX = Math.max(-1, Math.min(1, (mouseX - centerX) / (window.innerWidth  / 2)));
        const nY = Math.max(-1, Math.min(1, (mouseY - centerY) / (window.innerHeight / 2)));
        tX = -nY * MAX_TILT;
        tY =  nX * MAX_TILT;
        mX =  nX * MAX_MOVE;
        mY =  nY * MAX_MOVE;
      }

      curTiltX += (tX - curTiltX) * SMOOTHING;
      curTiltY += (tY - curTiltY) * SMOOTHING;
      curX     += (mX - curX)     * SMOOTHING;
      curY     += (mY - curY)     * SMOOTHING;

      floatingLayers.style.transform = `
        translate(calc(-50% + ${curX}px), calc(-50% + ${curY}px))
        rotateX(${curTiltX}deg)
        rotateY(${curTiltY}deg)
        perspective(1000px)
      `;
    }
    requestAnimationFrame(animate);
  }

  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; isInside = true; });
    heroSection.addEventListener('mouseenter', () => { isInside = true; });
    heroSection.addEventListener('mouseleave', () => { isInside = false; });
  }

  window.addEventListener('resize', () => {
    centerX = window.innerWidth  / 2;
    centerY = window.innerHeight / 2;
  });

  requestAnimationFrame(animate);

  // Hero CTA button ripple
  const contactBtn = document.querySelector('.hero-contact-btn');
  if (contactBtn) {
    contactBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const ripple = this.querySelector('.btn-ripple');
      if (ripple) {
        ripple.style.cssText = 'width:0; height:0; opacity:0;';
        setTimeout(() => {
          ripple.style.cssText = 'width:350px; height:350px; opacity:0.8;';
          setTimeout(() => { ripple.style.cssText = 'width:0; height:0; opacity:0;'; }, 600);
        }, 10);
      }
      // Navigate after ripple
      setTimeout(() => { window.location.href = this.href; }, 300);
    });
  }
})();


/* =============================================================================
   6. PRICING ANIMATIONS — PARTICLES, CARD TILT, SPARKLES, RIPPLE
   ============================================================================= */

class PricingAnimations {
  constructor() {
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this._init();
  }

  _init() {
    this._createParticles();
    this._setupMouseTracking();
    this._animateParticles();
    this._setupCardHoverEffects();
    this._setupButtonRipple();
    this._setupScrollObserver();
    this._animateTitleWords();
  }

  // --- Floating particle field ---
  _createParticles() {
    const field = document.querySelector('.particle-field');
    if (!field) return;

    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position:absolute;
        width:${Math.random() * 6 + 2}px;
        height:${Math.random() * 6 + 2}px;
        background:linear-gradient(45deg,var(--accent-color),var(--primary-color));
        border-radius:50%;
        opacity:${Math.random() * 0.5 + 0.2};
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        animation:particleFloat ${Math.random() * 10 + 15}s ease-in-out infinite;
        animation-delay:${Math.random() * 5}s;
      `;
      field.appendChild(el);
      this.particles.push({
        element: el,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }
  }

  _animateParticles() {
    const step = () => {
      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > window.innerWidth)  p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight)  p.vy *= -1;

        // Gentle mouse repulsion
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.x -= dx * force * 0.01;
          p.y -= dy * force * 0.01;
        }

        p.element.style.left = p.x + 'px';
        p.element.style.top  = p.y + 'px';
      });
      requestAnimationFrame(step);
    };
    step();
  }

  _setupMouseTracking() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    window.addEventListener('resize', () => {
      this.particles.forEach(p => {
        p.x = Math.random() * window.innerWidth;
        p.y = Math.random() * window.innerHeight;
      });
    });
  }

  // --- Card 3-D tilt on mouse move + sparkles on enter ---
  _setupCardHoverEffects() {
    document.querySelectorAll('.pricing-card').forEach(card => {
      card.addEventListener('mouseenter', () => this._spawnSparkles(card));
      card.addEventListener('mousemove',  (e) => this._tiltCard(card, e));
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  _tiltCard(card, e) {
    const r = card.getBoundingClientRect();
    const rX = (e.clientY - (r.top  + r.height / 2)) / 10;
    const rY = ((r.left + r.width / 2) - e.clientX) / 10;
    card.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-10px) scale(1.02)`;
  }

  _spawnSparkles(card) {
    for (let i = 0; i < 5; i++) {
      const s = document.createElement('div');
      s.style.cssText = `
        position:absolute; width:4px; height:4px;
        background:var(--accent-color); border-radius:50%;
        pointer-events:none;
        left:${Math.random() * 100}%; top:${Math.random() * 100}%;
        animation:sparkleAnimation 1s ease-out forwards;
      `;
      card.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    }
  }

  // --- Button ripple on click ---
  _setupButtonRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.select-plan-btn');
      if (!btn) return;
      const ripple = btn.querySelector('.btn-ripple');
      if (!ripple) return;

      const r    = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      ripple.style.cssText = `
        width:${size}px; height:${size}px;
        left:${e.clientX - r.left - size / 2}px;
        top:${e.clientY  - r.top  - size / 2}px;
        transform:scale(0);
      `;
      setTimeout(() => {
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity   = '0.3';
      }, 10);
      setTimeout(() => {
        ripple.style.opacity   = '0';
        ripple.style.transform = 'scale(1.5)';
      }, 300);
    });
  }

  // --- Scroll-triggered entrance for pricing wrappers ---
  _setupScrollObserver() {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('animate-in'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.pricing-card-wrapper, .fine-print-item').forEach(el => observer.observe(el));
  }

  // --- Stagger title word entrance ---
  _animateTitleWords() {
    document.querySelectorAll('.title-word').forEach(word => {
      const delay = parseInt(word.dataset.delay) || 0;
      word.style.animationDelay = `${delay}ms`;
    });
  }
}

// Only initialise pricing animations when a pricing section is in the DOM
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.pricing-preview, .pricing-preview-condensed')) {
    new PricingAnimations();
  }
});


/* =============================================================================
   7. PRICE COUNTER ANIMATION
   ============================================================================= */

class PriceCounter {
  constructor() {
    document.querySelectorAll('.price-number').forEach(el => {
      const target = parseInt(el.textContent);
      if (isNaN(target)) return;

      let current = 0;
      const increment = target / (2000 / 16); // 2-second duration at 60fps

      const timer = setInterval(() => {
        current += increment;
        el.textContent = Math.floor(current);
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        }
      }, 16);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.price-number')) new PriceCounter();
});


/* =============================================================================
   8. PRICING HEADER — GROW / SHRINK ON SCROLL
   ============================================================================= */

(function initPricingHeaderScroll() {
  const pricingHeader = document.querySelector('.pricing-header');
  if (!pricingHeader) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    pricingHeader.classList.toggle('grow', currentScrollY > lastScrollY);
    lastScrollY = currentScrollY;
  });
})();


/* =============================================================================
   9. PRICING MOBILE CAROUSEL
   ============================================================================= */

document.addEventListener('DOMContentLoaded', function () {
  const pricingSection = document.querySelector('.pricing-preview-condensed');
  if (!pricingSection) return;

  const CONFIG = {
    mobileBreakpoint: 768,
    autoAdvanceDelay: 5000,
    autoRestartDelay: 10000,
    swipeThreshold:   50,
    animationDuration: 300,
  };

  const state = {
    currentSlide: 0,
    totalSlides:  3,
    isMobile:     false,
    autoInterval: null,
    touchStartX:  0,
    isDragging:   false,
  };

  const els = {
    desktopGrid:    document.querySelector('.desktop-grid'),
    mobileCarousel: document.querySelector('.pricing-carousel'),
    carouselTrack:  document.querySelector('.carousel-track'),
    prevBtn:        document.getElementById('prevBtn'),
    nextBtn:        document.getElementById('nextBtn'),
    indicators:     document.querySelectorAll('.indicator'),
    titleWords:     document.querySelectorAll('.title-word'),
  };

  // --- Layout helpers ---
  function checkSize() {
    const wasMobile = state.isMobile;
    state.isMobile = window.innerWidth <= CONFIG.mobileBreakpoint;
    if (state.isMobile !== wasMobile) toggleLayout();
  }

  function toggleLayout() {
    if (state.isMobile) {
      if (els.desktopGrid)    els.desktopGrid.style.display    = 'none';
      if (els.mobileCarousel) els.mobileCarousel.style.display = 'block';
      populateCarousel();
      setupCarouselEvents();
      updateCarousel();
      startAuto();
    } else {
      if (els.desktopGrid)    els.desktopGrid.style.display    = 'grid';
      if (els.mobileCarousel) els.mobileCarousel.style.display = 'none';
      stopAuto();
    }
  }

  // --- Populate mobile carousel from desktop grid ---
  function populateCarousel() {
    if (!els.desktopGrid || !els.carouselTrack) return;
    const cards = els.desktopGrid.querySelectorAll('.pricing-card-wrapper');
    els.carouselTrack.innerHTML = '';
    cards.forEach((card, i) => {
      const clone = card.cloneNode(true);
      clone.style.opacity = '1';
      clone.style.transform = 'none';
      clone.classList.add('carousel-slide');
      clone.setAttribute('data-slide-index', i);
      els.carouselTrack.appendChild(clone);
    });
    state.totalSlides = els.carouselTrack.children.length;
  }

  // --- Carousel navigation ---
  function updateCarousel() {
    if (!els.carouselTrack) return;
    els.carouselTrack.style.transform  = `translateX(${-state.currentSlide * (100 / state.totalSlides)}%)`;
    els.carouselTrack.style.transition = `transform ${CONFIG.animationDuration}ms cubic-bezier(0.4,0,0.2,1)`;
    els.indicators.forEach((dot, i) => dot.classList.toggle('active', i === state.currentSlide));
    if (els.prevBtn) els.prevBtn.disabled = (state.currentSlide === 0);
    if (els.nextBtn) els.nextBtn.disabled = (state.currentSlide === state.totalSlides - 1);
  }

  function next() { state.currentSlide = (state.currentSlide + 1) % state.totalSlides; updateCarousel(); }
  function prev() { state.currentSlide = (state.currentSlide - 1 + state.totalSlides) % state.totalSlides; updateCarousel(); }
  function goTo(i) { state.currentSlide = i; updateCarousel(); }

  // --- Auto advance ---
  function startAuto() {
    if (!state.isMobile) return;
    stopAuto();
    state.autoInterval = setInterval(next, CONFIG.autoAdvanceDelay);
  }

  function stopAuto() {
    clearInterval(state.autoInterval);
    state.autoInterval = null;
  }

  function pauseAuto() {
    stopAuto();
    setTimeout(() => { if (state.isMobile) startAuto(); }, CONFIG.autoRestartDelay);
  }

  // --- Swipe / drag ---
  function handleSwipe(startX, endX) {
    const delta = startX - endX;
    if (Math.abs(delta) > CONFIG.swipeThreshold) {
      delta > 0 ? next() : prev();
    }
    setTimeout(startAuto, CONFIG.autoRestartDelay);
  }

  // --- Event binding ---
  function setupCarouselEvents() {
    if (els.nextBtn) els.nextBtn.addEventListener('click', () => { next(); pauseAuto(); });
    if (els.prevBtn) els.prevBtn.addEventListener('click', () => { prev(); pauseAuto(); });
    els.indicators.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); pauseAuto(); }));

    if (!els.carouselTrack) return;

    // Touch
    els.carouselTrack.addEventListener('touchstart', (e) => { state.touchStartX = e.touches[0].clientX; state.isDragging = true; stopAuto(); }, { passive: true });
    els.carouselTrack.addEventListener('touchmove',  (e) => { if (state.isDragging) { const dx = Math.abs(e.touches[0].clientX - state.touchStartX); if (dx > Math.abs(e.touches[0].clientY - state.touchStartX)) e.preventDefault(); } }, { passive: false });
    els.carouselTrack.addEventListener('touchend',   (e) => { if (state.isDragging) { handleSwipe(state.touchStartX, e.changedTouches[0].clientX); state.isDragging = false; } });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!state.isMobile) return;
      if (e.key === 'ArrowLeft')  { prev(); pauseAuto(); }
      if (e.key === 'ArrowRight') { next(); pauseAuto(); }
    });
  }

  // --- Init ---
  checkSize();
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(checkSize, 150); });
  document.addEventListener('visibilitychange', () => { document.hidden ? stopAuto() : setTimeout(startAuto, 1000); });
  window.addEventListener('beforeunload', stopAuto);
});


/* =============================================================================
   10. PORTFOLIO LIGHTBOX
   ============================================================================= */

document.addEventListener('DOMContentLoaded', function () {
  const lightbox    = document.getElementById('website-lightbox');
  const iframe      = document.getElementById('website-iframe');
  const titleEl     = document.getElementById('lightbox-title');
  const visitBtn    = document.getElementById('visit-website');
  const closeBtn    = document.getElementById('close-lightbox');
  const websiteBoxes = document.querySelectorAll('.website-box');

  // All elements must be present for the lightbox to function
  if (!lightbox || !iframe || !titleEl || !visitBtn || !closeBtn) return;

  let currentUrl = '';

  function open(url, title) {
    currentUrl       = url;
    titleEl.textContent = title || 'Website Preview';
    visitBtn.href    = url;
    iframe.src       = url;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    iframe.src = 'about:blank';
    document.body.style.overflow = '';
    currentUrl = '';
  }

  // Open on card click
  websiteBoxes.forEach(box => {
    box.addEventListener('click', () => open(box.dataset.url, box.dataset.title));
  });

  // Close handlers
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('active')) close(); });

  // Visit website button
  visitBtn.addEventListener('click', () => { if (currentUrl) window.open(currentUrl, '_blank'); });
});


/* =============================================================================
   INJECT RUNTIME CSS (ripple keyframe + reduced-motion overrides)
   ============================================================================= */

(function injectRuntimeStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      from { transform: scale(0); opacity: 1; }
      to   { transform: scale(2); opacity: 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .pricing-card,
      .floating-orb,
      .card-shine {
        animation: none !important;
        transition: none !important;
      }
      .pricing-card:hover { transform: none !important; }
    }
  `;
  document.head.appendChild(style);
})(); 
/* =============================================================================
   PRICING-NEW.JS — CoreStack Creative Interactive Pricing Logic
   Handles: plan switching, live preview, timeline animation, feature list
   ============================================================================= */

(function PricingPage() {

  // ── Plan Data ──────────────────────────────────────────────────────────────

  const PLANS = {
    basic: {
      number: '01',
      name: 'Basic',
      tagline: 'Perfect for getting your business online fast',
      price: 200,
      timelineWidth: '35%',
      timelineVal: '1–2 weeks',
      timelineEnd: '~Week 2',
      features: [
        'Full website build',
        'Clean HTML code',
        'Basic email support',
        '1 free photoshoot',
        'Paid upkeep available',
      ],
      chips: ['HTML', '1 Photoshoot', 'Basic Support', '1–2 Weeks'],
      ctaHref: 'contact.html?plan=Basic',
      ctaText: 'Get Started — Basic',
      url: 'yourbusiness.com',
      previewId: 'preview-basic',
    },
    regular: {
      number: '02',
      name: 'Regular',
      tagline: 'The sweet spot for most small businesses',
      price: 350,
      timelineWidth: '55%',
      timelineVal: '2–3 weeks',
      timelineEnd: '~Week 3',
      features: [
        'Full website build',
        'HTML or Weebly platform',
        'Normal turnaround time',
        '3 free photoshoots',
        'Mobile device support',
        'Paid upkeep available',
      ],
      chips: ['HTML or Weebly', '3 Photoshoots', 'Mobile Ready', '2–3 Weeks'],
      ctaHref: 'contact.html?plan=Regular',
      ctaText: 'Get Started — Regular',
      url: 'yourbusiness.com/premium',
      previewId: 'preview-regular',
    },
    premium: {
      number: '03',
      name: 'Premium',
      tagline: 'Maximum impact with a full e-commerce option',
      price: 500,
      timelineWidth: '80%',
      timelineVal: '3–4 weeks',
      timelineEnd: '~Week 4',
      features: [
        'Maximized website build',
        'HTML, Weebly, or Shopify',
        'Online store integration',
        'Priority queue position',
        'Unlimited photoshoots',
        'Mobile device support',
        'Priority support level',
      ],
      chips: ['HTML / Weebly / Shopify', 'Online Store', 'Unlimited Photoshoots', 'Priority Queue', '3–4 Weeks'],
      ctaHref: 'contact.html?plan=Premium',
      ctaText: 'Get Started — Premium',
      url: 'yourstore.com/shop',
      previewId: 'preview-premium',
    },
  };


  // ── Preview HTML Templates ─────────────────────────────────────────────────

  function buildPreviewBasic() {
    return `
      <div class="pxp pxp-basic">
        <div class="pxp-basic__nav">
          <div class="pxp-basic__logo"></div>
          <div class="pxp-basic__links">
            <div class="pxp-basic__link"></div>
            <div class="pxp-basic__link"></div>
            <div class="pxp-basic__link"></div>
          </div>
        </div>
        <div class="pxp-basic__hero">
          <div class="pxp-basic__h1"></div>
          <div class="pxp-basic__sub"></div>
          <div class="pxp-basic__sub2"></div>
          <div class="pxp-basic__btn"></div>
        </div>
        <div class="pxp-basic__content">
          <div class="pxp-basic__card">
            <div class="pxp-basic__card-icon"></div>
            <div class="pxp-basic__card-line"></div>
            <div class="pxp-basic__card-line"></div>
          </div>
          <div class="pxp-basic__card">
            <div class="pxp-basic__card-icon"></div>
            <div class="pxp-basic__card-line"></div>
            <div class="pxp-basic__card-line"></div>
          </div>
          <div class="pxp-basic__card">
            <div class="pxp-basic__card-icon"></div>
            <div class="pxp-basic__card-line"></div>
            <div class="pxp-basic__card-line"></div>
          </div>
        </div>
      </div>`;
  }

  function buildPreviewRegular() {
    return `
      <div class="pxp pxp-regular">
        <div class="pxp-regular__nav">
          <div class="pxp-regular__logo"></div>
          <div class="pxp-regular__links">
            <div class="pxp-regular__link"></div>
            <div class="pxp-regular__link"></div>
            <div class="pxp-regular__link"></div>
          </div>
        </div>
        <div class="pxp-regular__hero">
          <div class="pxp-regular__hero-text">
            <div class="pxp-regular__h1"></div>
            <div class="pxp-regular__h1b"></div>
            <div class="pxp-regular__sub"></div>
            <div class="pxp-regular__sub2"></div>
            <div class="pxp-regular__btns">
              <div class="pxp-regular__btn-primary"></div>
              <div class="pxp-regular__btn-sec"></div>
            </div>
          </div>
          <div class="pxp-regular__hero-img"></div>
        </div>
        <div class="pxp-regular__mobile-badge">
          <div class="pxp-regular__mobile-icon"></div>
          Mobile Optimised
        </div>
        <div class="pxp-regular__features">
          <div class="pxp-regular__feat">
            <div class="pxp-regular__feat-icon"></div>
            <div class="pxp-regular__feat-text">
              <div class="pxp-regular__feat-line"></div>
              <div class="pxp-regular__feat-line"></div>
            </div>
          </div>
          <div class="pxp-regular__feat">
            <div class="pxp-regular__feat-icon"></div>
            <div class="pxp-regular__feat-text">
              <div class="pxp-regular__feat-line"></div>
              <div class="pxp-regular__feat-line"></div>
            </div>
          </div>
          <div class="pxp-regular__feat">
            <div class="pxp-regular__feat-icon"></div>
            <div class="pxp-regular__feat-text">
              <div class="pxp-regular__feat-line"></div>
              <div class="pxp-regular__feat-line"></div>
            </div>
          </div>
          <div class="pxp-regular__feat">
            <div class="pxp-regular__feat-icon"></div>
            <div class="pxp-regular__feat-text">
              <div class="pxp-regular__feat-line"></div>
              <div class="pxp-regular__feat-line"></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function buildPreviewPremium() {
    return `
      <div class="pxp pxp-premium">
        <div class="pxp-premium__nav">
          <div class="pxp-premium__logo"></div>
          <div class="pxp-premium__links">
            <div class="pxp-premium__link"></div>
            <div class="pxp-premium__link"></div>
            <div class="pxp-premium__link"></div>
            <div class="pxp-premium__cart"></div>
          </div>
        </div>
        <div class="pxp-premium__hero">
          <div class="pxp-premium__tag">Now with Online Store</div>
          <div class="pxp-premium__h1"></div>
          <div class="pxp-premium__h1b"></div>
          <div class="pxp-premium__sub"></div>
          <div class="pxp-premium__sub2"></div>
          <div class="pxp-premium__btns">
            <div class="pxp-premium__btn-primary"></div>
            <div class="pxp-premium__btn-sec"></div>
          </div>
        </div>
        <div class="pxp-premium__shopify-badge">
          <div class="pxp-premium__shopify-dot"></div>
          Powered by Shopify — E-commerce Ready
        </div>
        <div class="pxp-premium__store">
          <div class="pxp-premium__product">
            <div class="pxp-premium__product-img"></div>
            <div class="pxp-premium__product-info">
              <div class="pxp-premium__product-line"></div>
              <div class="pxp-premium__product-price"></div>
            </div>
          </div>
          <div class="pxp-premium__product">
            <div class="pxp-premium__product-img"></div>
            <div class="pxp-premium__product-info">
              <div class="pxp-premium__product-line"></div>
              <div class="pxp-premium__product-price"></div>
            </div>
          </div>
          <div class="pxp-premium__product">
            <div class="pxp-premium__product-img"></div>
            <div class="pxp-premium__product-info">
              <div class="pxp-premium__product-line"></div>
              <div class="pxp-premium__product-price"></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  const PREVIEWS = {
    basic:   buildPreviewBasic,
    regular: buildPreviewRegular,
    premium: buildPreviewPremium,
  };


  // ── DOM References ─────────────────────────────────────────────────────────

  const tabs         = document.querySelectorAll('.px-tab');
  const planNumber   = document.getElementById('planNumber');
  const planName     = document.getElementById('planName');
  const planTagline  = document.getElementById('planTagline');
  const planPrice    = document.getElementById('planPrice');
  const planFeatures = document.getElementById('planFeatures');
  const planCta      = document.getElementById('planCta');
  const timelineFill = document.getElementById('timelineFill');
  const timelineVal  = document.getElementById('timelineVal');
  const timelineEnd  = document.getElementById('timelineEnd');
  const chipRow      = document.getElementById('chipRow');
  const browserViewport = document.getElementById('browserViewport');
  const previewUrl   = document.getElementById('previewUrl');

  if (!tabs.length) return; // Not on pricing page


  // ── State ──────────────────────────────────────────────────────────────────

  let activePlan = 'regular';
  let isAnimating = false;


  // ── Helper: animate counting price ────────────────────────────────────────

  function animatePrice(from, to) {
    if (!planPrice) return;
    const duration = 500;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      planPrice.textContent = Math.round(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }


  // ── Helper: render feature list ───────────────────────────────────────────

  function renderFeatures(features) {
    if (!planFeatures) return;
    planFeatures.innerHTML = features
      .map((f, i) => `<li style="animation-delay:${i * 60}ms">${f}</li>`)
      .join('');
  }


  // ── Helper: render chip row ───────────────────────────────────────────────

  function renderChips(chips) {
    if (!chipRow) return;
    chipRow.innerHTML = chips
      .map((c, i) => `<span class="px-chip" style="animation-delay:${i * 60}ms">${c}</span>`)
      .join('');
  }


  // ── Helper: render browser preview ────────────────────────────────────────

  let currentPreviewEl = null;

  function renderPreview(planKey) {
    if (!browserViewport) return;

    // Create new preview
    const newEl = document.createElement('div');
    newEl.classList.add('px-site-preview');
    newEl.innerHTML = PREVIEWS[planKey]();
    browserViewport.appendChild(newEl);

    // Fade out old, fade in new
    if (currentPreviewEl) {
      const old = currentPreviewEl;
      old.style.opacity = '0';
      old.style.transform = 'translateY(-10px) scale(0.97)';
      old.style.transition = 'all 0.35s ease';
      setTimeout(() => old.remove(), 380);
    }

    // Trigger reflow then activate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        newEl.classList.add('active');
      });
    });

    currentPreviewEl = newEl;
  }


  // ── Core: switch plan ─────────────────────────────────────────────────────

  function switchPlan(planKey) {
    if (planKey === activePlan || isAnimating) return;
    isAnimating = true;

    const prev = PLANS[activePlan];
    const next = PLANS[planKey];
    activePlan = planKey;

    // Update tabs
    tabs.forEach(tab => {
      const isActive = tab.dataset.plan === planKey;
      tab.classList.toggle('px-tab--active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Animate plan number
    if (planNumber) {
      planNumber.classList.add('px-name-animating');
      setTimeout(() => {
        planNumber.textContent = next.number;
        planNumber.classList.remove('px-name-animating');
      }, 200);
    }

    // Animate plan name + tagline
    if (planName) {
      planName.classList.add('px-name-animating');
      setTimeout(() => {
        planName.textContent = next.name;
        planName.classList.remove('px-name-animating');
      }, 200);
    }

    if (planTagline) {
      setTimeout(() => { planTagline.textContent = next.tagline; }, 200);
    }

    // Animate price
    planPrice?.classList.add('px-price-animating');
    setTimeout(() => {
      animatePrice(prev.price, next.price);
      planPrice?.classList.remove('px-price-animating');
    }, 250);

    // Timeline
    if (timelineFill) timelineFill.style.width = next.timelineWidth;
    if (timelineVal)  timelineVal.textContent   = next.timelineVal;
    if (timelineEnd)  timelineEnd.textContent   = next.timelineEnd;

    // Features
    setTimeout(() => renderFeatures(next.features), 100);

    // CTA
    if (planCta) {
      planCta.href = next.ctaHref;
      planCta.querySelector('.px-cta__text').textContent = next.ctaText;
    }

    // URL bar
    if (previewUrl) {
      setTimeout(() => { previewUrl.textContent = next.url; }, 200);
    }

    // Preview
    setTimeout(() => renderPreview(planKey), 80);

    // Chips
    setTimeout(() => renderChips(next.chips), 120);

    setTimeout(() => { isAnimating = false; }, 600);
  }


  // ── Init ───────────────────────────────────────────────────────────────────

  function init() {
    // Bind tab click events
    tabs.forEach(tab => {
      tab.addEventListener('click', () => switchPlan(tab.dataset.plan));
    });

    // Render initial plan (regular)
    const initial = PLANS[activePlan];
    renderFeatures(initial.features);
    renderChips(initial.chips);
    renderPreview(activePlan);

    if (timelineFill) timelineFill.style.width = initial.timelineWidth;

    // Check if navigated from home page with a plan in hash/param
    const urlParams = new URLSearchParams(window.location.search);
    const startPlan = urlParams.get('highlight');
    if (startPlan && PLANS[startPlan]) {
      // Small delay to let page settle, then smoothly switch
      setTimeout(() => {
        switchPlan(startPlan);
        // Scroll to stage
        const stage = document.querySelector('.px-stage');
        if (stage) {
          stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 600);
    }
  }


  // ── Scroll-triggered table row reveals ────────────────────────────────────

  function initTableReveal() {
    const rows = document.querySelectorAll('.px-table tbody tr');
    if (!rows.length) return;

    rows.forEach((row, i) => {
      row.style.opacity = '0';
      row.style.transform = 'translateY(16px)';
      row.style.transition = `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms`;
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tableRows = entry.target.querySelectorAll('tbody tr');
          tableRows.forEach(r => {
            r.style.opacity = '1';
            r.style.transform = 'translateY(0)';
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const table = document.querySelector('.px-table-wrap');
    if (table) observer.observe(table);
  }


  // ── FAQ item hover expand ──────────────────────────────────────────────────

  function initFaqReveal() {
    const items = document.querySelectorAll('.px-faq__item');
    if (!items.length) return;

    items.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms, border-color 0.3s, box-shadow 0.3s`;
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(item => observer.observe(item));
  }


  // ── Smooth transition from home page pricing cards ─────────────────────────
  // The home page pr-cards link to pricing.html
  // We add a small page-entry highlight if plan param is passed via URL

  function handleEntryFromHome() {
    // If ?plan= is in URL (from contact page links, not highlight)
    // nothing extra needed — the selector rail handles visual state.

    // Detect if referrer was index.html (home) for entry animation variant
    const fromHome = document.referrer.includes('index.html') || document.referrer.endsWith('/');
    if (fromHome) {
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.4s ease';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.style.opacity = '1';
        });
      });
    }
  }


  // ── Run ────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    handleEntryFromHome();
    init();
    initTableReveal();
    initFaqReveal();
  });


  // ── Update home page pricing cards to pass highlight param ────────────────
  // Run on the home page — intercepts clicks on .pr-card links

  const homeCards = document.querySelectorAll('.pr-card[data-tier]');
  homeCards.forEach(card => {
    const href = card.getAttribute('href');
    if (href && href.includes('pricing.html')) {
      card.addEventListener('click', function(e) {
        const tier = this.dataset.tier;
        if (tier) {
          e.preventDefault();
          // Page transition shimmer
          document.body.style.opacity = '0';
          document.body.style.transition = 'opacity 0.3s ease';
          setTimeout(() => {
            window.location.href = `pricing.html?highlight=${tier}`;
          }, 280);
        }
      });
    }
  });

})();