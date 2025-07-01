document.addEventListener("DOMContentLoaded", () => {
  let lastScrollY = window.scrollY;
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    // Add a small threshold to prevent jittery behavior
    if (Math.abs(currentScrollY - lastScrollY) < 5) {
      return;
    }

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down and past 100px - hide the header completely
      header.classList.add("hidden");
      header.classList.remove("faded");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up - show the header
      header.classList.remove("hidden");

      if (currentScrollY > 50) {
        header.classList.add("faded");
      } else {
        header.classList.remove("faded");
      }
    }

    lastScrollY = currentScrollY;
  });
});

const stepBoxes = document.querySelectorAll('.step-box');

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 200); // stagger delay (0ms, 200ms, 400ms...)
      observer.unobserve(entry.target); // stop watching after animation
    }
  });
}, {
  threshold: 0.1 // only trigger when 10% of the box is in view
});

stepBoxes.forEach(box => {
  observer.observe(box);
});

document.addEventListener('DOMContentLoaded', () => {
  const notes = document.querySelectorAll('.note-card');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${index * 500}ms`;
        entry.target.classList.add('tack-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2  
  });

  notes.forEach(note => observer.observe(note));
});

// Portfolio Lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    const websiteBoxes = document.querySelectorAll('.website-box');
    const lightbox = document.getElementById('website-lightbox');
    const iframe = document.getElementById('website-iframe');
    const lightboxTitle = document.getElementById('lightbox-title');
    const visitWebsiteBtn = document.getElementById('visit-website');
    const closeBtn = document.getElementById('close-lightbox');
    
    // Only run lightbox code if all required elements exist
    if (lightbox && iframe && lightboxTitle && visitWebsiteBtn && closeBtn) {
        let currentWebsiteUrl = '';
        
        // Open lightbox when website box is clicked
        websiteBoxes.forEach(box => {
            box.addEventListener('click', function() {
                const url = this.getAttribute('data-url');
                const title = this.getAttribute('data-title');
                
                openLightbox(url, title);
            });
        });
        
        // Close lightbox when close button is clicked
        closeBtn.addEventListener('click', closeLightbox);
        
        // Close lightbox when clicking on overlay (outside the container)
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Close lightbox when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
        
        // Visit website button functionality
        visitWebsiteBtn.addEventListener('click', function() {
            if (currentWebsiteUrl) {
                window.open(currentWebsiteUrl, '_blank');
            }
        });
        
        function openLightbox(url, title) {
            currentWebsiteUrl = url;
            lightboxTitle.textContent = title || 'Website Preview';
            visitWebsiteBtn.href = url;
            iframe.src = url;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            iframe.src = 'about:blank'; // Clear iframe to stop loading
            document.body.style.overflow = ''; // Restore scrolling
            currentWebsiteUrl = '';
        }
        
        // Handle iframe loading errors (optional)
        iframe.addEventListener('error', function() {
            console.warn('Could not load website in iframe. This may be due to X-Frame-Options restrictions.');
        });
        
        // Optional: Add loading state
        iframe.addEventListener('load', function() {
            // You can add loading indicators here if needed
            console.log('Website loaded in lightbox');
        });
    }
});

// Function to dynamically add new website boxes (for easy expansion)
function addWebsiteBox(url, title, description, parentElement = '.portfolio-grid') {
    const grid = document.querySelector(parentElement);
    if (!grid) return;
    
    const websiteBox = document.createElement('div');
    websiteBox.className = 'website-box';
    websiteBox.setAttribute('data-url', url);
    websiteBox.setAttribute('data-title', title);
    
    websiteBox.innerHTML = `
        <div class="website-preview">
            <div class="preview-header">
                <div class="browser-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div class="preview-content">
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="preview-overlay">
                    <span>Click to Preview</span>
                </div>
            </div>
        </div>
    `;
    
    // Add click event listener
    websiteBox.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        const title = this.getAttribute('data-title');
        openLightbox(url, title);
    });
    
    grid.appendChild(websiteBox);
}

// Pricing Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observe all elements with reveal-up class
    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach(element => {
        observer.observe(element);
    });

    // Enhanced hover effects for pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        // Add subtle tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (mouseY / rect.height) * -10;
            const rotateY = (mouseX / rect.width) * 10;
            
            card.style.transform = `
                translateY(-10px) 
                scale(${card.classList.contains('featured') ? '1.07' : '1.02'}) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
        
        // Add click ripple effect to CTA buttons
        const ctaButton = card.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', function(e) {
                // Only preventDefault if the button is a <button>, not an <a>
                if (ctaButton.tagName.toLowerCase() === 'button') {
                    e.preventDefault();
                }
                
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = ctaButton.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                ctaButton.style.position = 'relative';
                ctaButton.style.overflow = 'hidden';
                ctaButton.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                // Add success feedback
                const originalText = ctaButton.textContent;
                ctaButton.textContent = 'Let\'s Talk!';
                ctaButton.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                
                setTimeout(() => {
                    ctaButton.textContent = originalText;
                    ctaButton.style.background = '';
                }, 1500);
            });
        }
    });

    // Parallax effect for floating orbs
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const orbs = document.querySelectorAll('.floating-orb');
        orbs.forEach((orb, index) => {
            const speed = 0.3 + (index * 0.1);
            orb.style.transform = `translateY(${rate * speed}px)`;
        });
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Only add scroll listener if reduced motion is not preferred
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', requestTick);
    }

    // Add subtle animation delay for staggered card appearance
    const cards = document.querySelectorAll('.pricing-card[data-delay]');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${0.1 * (index + 1)}s`;
    });

    // Add smooth scroll behavior for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// CSS Animation for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    /* Accessibility: Respect user's motion preferences */
    @media (prefers-reduced-motion: reduce) {
        .pricing-card,
        .floating-orb,
        .card-shine {
            animation: none !important;
            transition: none !important;
        }
        
        .pricing-card:hover {
            transform: none !important;
        }
    }
`;
document.head.appendChild(style);

// Pricing Section Professional Animations
class PricingAnimations {
  constructor() {
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.init();
  }

  init() {
    this.createParticles();
    this.setupEventListeners();
    this.animateParticles();
    this.setupIntersectionObserver();
    this.animateTitleWords();
    this.animateFeatureItems();
    this.setupCardHoverEffects();
    this.setupButtonRippleEffect();
  }

  // Create floating particles
  createParticles() {
    const particleField = document.querySelector('.particle-field');
    if (!particleField) return;
    
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        background: linear-gradient(45deg, var(--accent-color), var(--primary-color));
        border-radius: 50%;
        opacity: ${Math.random() * 0.5 + 0.2};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particleFloat ${Math.random() * 10 + 15}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      particleField.appendChild(particle);
      this.particles.push({
        element: particle,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 6 + 2
      });
    }
  }

  // Animate particles
  animateParticles() {
    const animateFrame = () => {
      this.particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > window.innerWidth) {
          particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > window.innerHeight) {
          particle.vy *= -1;
        }

        // Mouse interaction
        const dx = this.mouseX - particle.x;
        const dy = this.mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.x -= dx * force * 0.01;
          particle.y -= dy * force * 0.01;
        }

        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
      });

      requestAnimationFrame(animateFrame);
    };
    animateFrame();
  }

  // Setup event listeners
  setupEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    window.addEventListener('resize', () => {
      this.particles.forEach(particle => {
        particle.x = Math.random() * window.innerWidth;
        particle.y = Math.random() * window.innerHeight;
      });
    });
  }

  // Animate title words
  animateTitleWords() {
    const titleWords = document.querySelectorAll('.title-word');
    titleWords.forEach((word, index) => {
      const delay = parseInt(word.dataset.delay) || 0;
      word.style.animationDelay = `${delay}ms`;
    });
  }

  // Animate feature items
  animateFeatureItems() {
    const featureItems = document.querySelectorAll('.features-list li');
    featureItems.forEach((item, index) => {
      const delay = parseInt(item.dataset.delay) || 0;
      item.style.animationDelay = `${delay}ms`;
    });
  }

  // Setup intersection observer for scroll animations
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.pricing-card-wrapper, .fine-print-item').forEach(el => {
      observer.observe(el);
    });
  }

  // Setup card hover effects
  setupCardHoverEffects() {
    const cards = document.querySelectorAll('.pricing-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.createCardSparkles(card);
      });

      card.addEventListener('mousemove', (e) => {
        this.updateCardTilt(card, e);
      });

      card.addEventListener('mouseleave', () => {
        this.resetCardTilt(card);
      });
    });
  }

  // Create sparkle effect on card hover
  createCardSparkles(card) {
    for (let i = 0; i < 5; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--accent-color);
        border-radius: 50%;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: sparkleAnimation 1s ease-out forwards;
      `;
      card.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 1000);
    }
  }

  // Update card tilt based on mouse position
  updateCardTilt(card, e) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (centerX - e.clientX) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
  }

  // Reset card tilt
  resetCardTilt(card) {
    card.style.transform = '';
  }

  // Setup button ripple effect
  setupButtonRippleEffect() {
    const buttons = document.querySelectorAll('.select-plan-btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = button.querySelector('.btn-ripple');
        if (!ripple) return;
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.transform = 'scale(0)';
        
        setTimeout(() => {
          ripple.style.transform = 'scale(4)';
        }, 10);
      });
    });
  }
}

// Price counter animation
class PriceCounter {
  constructor() {
    this.counters = document.querySelectorAll('.price-number');
    this.init();
  }

  init() {
    this.animateCounters();
  }

  animateCounters() {
    this.counters.forEach(counter => {
      const target = parseInt(counter.textContent);
      if (isNaN(target)) return;
      
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        counter.textContent = Math.floor(current);
        
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        }
      }, 16);
    });
  }
}

// Pricing Header Grow/Shrink on Scroll
(function() {
  let lastScrollY = window.scrollY;
  const pricingHeader = document.querySelector('.pricing-header');
  if (!pricingHeader) return;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      // Scrolling down – grow the bar
      pricingHeader.classList.add('grow');
    } else {
      // Scrolling up – shrink the bar
      pricingHeader.classList.remove('grow');
    }
    lastScrollY = currentScrollY;
  });
})();

// Mobile Navigation Handler
class MobileNavigation {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.mobileNav = document.getElementById('mobileNav');
        this.init();
    }

    init() {
        // Check if elements exist before adding event listeners
        if (!this.hamburger || !this.mobileNav) {
            console.warn('Hamburger or mobile nav elements not found');
            return;
        }

        this.addEventListeners();
    }

    addEventListeners() {
        // Toggle menu when hamburger is clicked
        this.hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        // Close menu when clicking on navigation links
        const mobileLinks = this.mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (this.isMenuOpen() && 
                !this.mobileNav.contains(event.target) && 
                !this.hamburger.contains(event.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isMenuOpen()) {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen()) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isMenuOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.hamburger.classList.add('active');
        this.mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.mobileNav.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    isMenuOpen() {
        return this.mobileNav.classList.contains('active');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    new MobileNavigation();

    // Initialize other components if they exist
    initializeOtherComponents();
});

// Function to initialize other components
function initializeOtherComponents() {
    // Initialize pricing animations if on pricing page
    if (document.querySelector('.pricing-section')) {
        // Only initialize if the classes exist
        if (typeof PricingAnimations !== 'undefined') {
            new PricingAnimations();
        }
        if (typeof PriceCounter !== 'undefined') {
            new PriceCounter();
        }
    }

    // Add other component initializations here as needed
}

// Alternative simple implementation (if you prefer a more basic approach)
function initSimpleHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    // Close menu when clicking links
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(event.target) && 
            !hamburger.contains(event.target)) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
}

// Uncomment the line below if you want to use the simple version instead
// document.addEventListener('DOMContentLoaded', initSimpleHamburgerMenu);

// Enhanced Pricing Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const pricingSection = document.querySelector('.pricing-preview-condensed');
    if (!pricingSection) return;

    // Configuration
    const config = {
        mobileBreakpoint: 768,
        autoAdvanceDelay: 5000,
        autoRestartDelay: 10000,
        swipeThreshold: 50,
        animationDuration: 300
    };

    // State management
    let state = {
        currentSlide: 0,
        totalSlides: 3,
        isMobile: false,
        autoAdvanceInterval: null,
        isInitialized: false,
        touchStartX: 0,
        touchStartY: 0,
        isDragging: false
    };

    // DOM elements
    const elements = {
        desktopGrid: document.querySelector('.desktop-grid'),
        mobileCarousel: document.querySelector('.pricing-carousel'),
        carouselTrack: document.querySelector('.carousel-track'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        indicators: document.querySelectorAll('.indicator'),
        titleWords: document.querySelectorAll('.title-word')
    };

    // Initialize everything
    init();

    function init() {
        initializeTitleAnimation();
        checkScreenSize();
        initializeScrollAnimations();
        initializeButtonEffects();
        
        // Add optimized resize listener
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 150);
        });

        state.isInitialized = true;
    }

    // Enhanced title animation
    function initializeTitleAnimation() {
        elements.titleWords.forEach((word, index) => {
            const delay = parseInt(word.dataset.delay) || (index * 200);
            word.style.animationDelay = `${delay}ms`;
            word.classList.add('animate-in');
        });
    }

    // Check screen size and switch layouts
    function checkScreenSize() {
        const wasMobile = state.isMobile;
        state.isMobile = window.innerWidth <= config.mobileBreakpoint;
        
        if (state.isMobile !== wasMobile || !state.isInitialized) {
            toggleLayout();
        }
    }

    // Toggle between desktop and mobile layouts
    function toggleLayout() {
        if (state.isMobile) {
            showMobileLayout();
            initializeMobileCarousel();
        } else {
            showDesktopLayout();
            cleanupMobileCarousel();
        }
    }

    function showMobileLayout() {
        if (elements.desktopGrid) elements.desktopGrid.style.display = 'none';
        if (elements.mobileCarousel) elements.mobileCarousel.style.display = 'block';
    }

    function showDesktopLayout() {
        if (elements.desktopGrid) elements.desktopGrid.style.display = 'grid';
        if (elements.mobileCarousel) elements.mobileCarousel.style.display = 'none';
    }

    // Enhanced mobile carousel functionality
    function initializeMobileCarousel() {
        if (!state.isMobile || !elements.carouselTrack) return;

        populateCarousel();
        setupCarouselEvents();
        updateCarousel();
        startAutoAdvance();
    }

    function populateCarousel() {
        if (!elements.desktopGrid || !elements.carouselTrack) return;
        
        const cards = elements.desktopGrid.querySelectorAll('.pricing-card-wrapper');
        elements.carouselTrack.innerHTML = '';
        
        cards.forEach((card, index) => {
            const clonedCard = card.cloneNode(true);
            clonedCard.style.opacity = '1';
            clonedCard.style.transform = 'none';
            clonedCard.classList.add('carousel-slide');
            clonedCard.setAttribute('data-slide-index', index);
            elements.carouselTrack.appendChild(clonedCard);
        });

        // Update total slides count
        state.totalSlides = elements.carouselTrack.children.length;
    }

    function setupCarouselEvents() {
        // Navigation buttons
        if (elements.nextBtn) {
            elements.nextBtn.addEventListener('click', () => {
                nextSlide();
                pauseAutoAdvance();
            });
        }

        if (elements.prevBtn) {
            elements.prevBtn.addEventListener('click', () => {
                prevSlide();
                pauseAutoAdvance();
            });
        }

        // Indicators
        elements.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
                pauseAutoAdvance();
            });
        });

        // Enhanced touch support
        setupTouchEvents();
        
        // Keyboard navigation
        setupKeyboardEvents();
    }

    function setupTouchEvents() {
        if (!elements.carouselTrack) return;

        elements.carouselTrack.addEventListener('touchstart', handleTouchStart, { passive: false });
        elements.carouselTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
        elements.carouselTrack.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Mouse events for desktop testing
        elements.carouselTrack.addEventListener('mousedown', handleMouseStart);
        elements.carouselTrack.addEventListener('mousemove', handleMouseMove);
        elements.carouselTrack.addEventListener('mouseup', handleMouseEnd);
        elements.carouselTrack.addEventListener('mouseleave', handleMouseEnd);
    }

    function handleTouchStart(e) {
        state.touchStartX = e.touches[0].clientX;
        state.touchStartY = e.touches[0].clientY;
        state.isDragging = true;
        stopAutoAdvance();
    }

    function handleTouchMove(e) {
        if (!state.isDragging) return;
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = Math.abs(touchX - state.touchStartX);
        const deltaY = Math.abs(touchY - state.touchStartY);
        
        // Prevent vertical scrolling when swiping horizontally
        if (deltaX > deltaY) {
            e.preventDefault();
        }
    }

    function handleTouchEnd(e) {
        if (!state.isDragging) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        handleSwipe(state.touchStartX, touchEndX);
        state.isDragging = false;
    }

    function handleMouseStart(e) {
        state.touchStartX = e.clientX;
        state.isDragging = true;
        stopAutoAdvance();
        e.preventDefault();
    }

    function handleMouseMove(e) {
        if (!state.isDragging) return;
        e.preventDefault();
    }

    function handleMouseEnd(e) {
        if (!state.isDragging) return;
        
        handleSwipe(state.touchStartX, e.clientX);
        state.isDragging = false;
    }

    function handleSwipe(startX, endX) {
        const swipeDistance = startX - endX;
        
        if (Math.abs(swipeDistance) > config.swipeThreshold) {
            if (swipeDistance > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        setTimeout(() => startAutoAdvance(), config.autoRestartDelay);
    }

    function setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (!state.isMobile) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    pauseAutoAdvance();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    pauseAutoAdvance();
                    break;
                case 'Home':
                    e.preventDefault();
                    goToSlide(0);
                    pauseAutoAdvance();
                    break;
                case 'End':
                    e.preventDefault();
                    goToSlide(state.totalSlides - 1);
                    pauseAutoAdvance();
                    break;
            }
        });
    }

    // Enhanced carousel navigation
    function updateCarousel() {
        if (!elements.carouselTrack) return;
        
        const translateX = -state.currentSlide * (100 / state.totalSlides);
        elements.carouselTrack.style.transform = `translateX(${translateX}%)`;
        elements.carouselTrack.style.transition = `transform ${config.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        
        updateIndicators();
        updateNavigationButtons();
        updateAccessibility();
    }

    function updateIndicators() {
        elements.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === state.currentSlide);
            indicator.setAttribute('aria-pressed', index === state.currentSlide);
        });
    }

    function updateNavigationButtons() {
        if (elements.prevBtn) {
            elements.prevBtn.disabled = state.currentSlide === 0;
            elements.prevBtn.setAttribute('aria-disabled', state.currentSlide === 0);
        }
        
        if (elements.nextBtn) {
            elements.nextBtn.disabled = state.currentSlide === state.totalSlides - 1;
            elements.nextBtn.setAttribute('aria-disabled', state.currentSlide === state.totalSlides - 1);
        }
    }

    function updateAccessibility() {
        if (elements.carouselTrack) {
            elements.carouselTrack.setAttribute('aria-live', 'polite');
            elements.carouselTrack.setAttribute('aria-label', `Slide ${state.currentSlide + 1} of ${state.totalSlides}`);
        }
    }

    function nextSlide() {
        if (state.currentSlide < state.totalSlides - 1) {
            state.currentSlide++;
        } else {
            state.currentSlide = 0; // Loop back to first slide
        }
        updateCarousel();
    }

    function prevSlide() {
        if (state.currentSlide > 0) {
            state.currentSlide--;
        } else {
            state.currentSlide = state.totalSlides - 1; // Loop to last slide
        }
        updateCarousel();
    }

    function goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < state.totalSlides) {
            state.currentSlide = slideIndex;
            updateCarousel();
        }
    }

    // Enhanced auto-advance functionality
    function startAutoAdvance() {
        if (!state.isMobile) return;
        
        stopAutoAdvance();
        state.autoAdvanceInterval = setInterval(() => {
            nextSlide();
        }, config.autoAdvanceDelay);
    }

    function stopAutoAdvance() {
        if (state.autoAdvanceInterval) {
            clearInterval(state.autoAdvanceInterval);
            state.autoAdvanceInterval = null;
        }
    }

    function pauseAutoAdvance() {
        stopAutoAdvance();
        setTimeout(() => {
            if (state.isMobile) startAutoAdvance();
        }, config.autoRestartDelay);
    }

    // Cleanup mobile carousel
    function cleanupMobileCarousel() {
        stopAutoAdvance();
        state.currentSlide = 0;
    }

    // Enhanced button effects
    function initializeButtonEffects() {
        document.addEventListener('click', handleButtonClick);
    }

    function handleButtonClick(e) {
        const button = e.target.closest('.select-plan-btn');
        if (!button) return;
        
        createRippleEffect(button, e);
    }

    function createRippleEffect(button, e) {
        const ripple = button.querySelector('.btn-ripple');
        if (!ripple) return;
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.transform = 'scale(0)';
        
        requestAnimationFrame(() => {
            ripple.style.transform = 'scale(1)';
            ripple.style.opacity = '0.3';
        });
        
        setTimeout(() => {
            ripple.style.opacity = '0';
            ripple.style.transform = 'scale(1.5)';
        }, 300);
    }

    // Enhanced scroll animations
    function initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initializeFeatureAnimations();
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        if (pricingSection) {
            observer.observe(pricingSection);
        }
    }

    function initializeFeatureAnimations() {
        const features = document.querySelectorAll('.features-list li');
        features.forEach((feature, index) => {
            const delay = parseInt(feature.dataset.delay) || (index * 100);
            feature.style.animationDelay = `${delay}ms`;
            feature.classList.add('animate-feature');
        });
    }

    // Enhanced resize handler
    function handleResize() {
        checkScreenSize();
        
        // Reset carousel position if switching layouts
        if (state.isMobile && elements.carouselTrack) {
            updateCarousel();
        }
    }

    // Visibility change handler for auto-advance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoAdvance();
        } else if (state.isMobile) {
            setTimeout(() => startAutoAdvance(), 1000);
        }
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        stopAutoAdvance();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero-section');
    const floatingLayers = document.querySelector('.floating-layers');
    
    // Only proceed if floating layers exist
    if (!floatingLayers) return;
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isMouseInside = false;
    
    // Smooth interpolation values
    let currentTiltX = 0;
    let currentTiltY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Animation constants
    const maxTilt = 12; // Maximum tilt in degrees
    const maxMove = 15; // Maximum position offset in pixels
    const smoothing = 0.08; // Smoothing factor (lower = smoother)
    
    // Center positioning
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    
    // Performance optimization
    let lastTime = 0;
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;
    
    function animateLayers(currentTime) {
        // Frame rate control
        if (currentTime - lastTime < frameTime) {
            requestAnimationFrame(animateLayers);
            return;
        }
        lastTime = currentTime;
        
        let targetTiltX = 0;
        let targetTiltY = 0;
        let targetX = 0;
        let targetY = 0;
        
        if (isMouseInside) {
            // Calculate mouse offset from center
            const offsetX = mouseX - centerX;
            const offsetY = mouseY - centerY;
            
            // Calculate normalized values (-1 to 1)
            const normalizedX = Math.max(-1, Math.min(1, offsetX / (window.innerWidth / 2)));
            const normalizedY = Math.max(-1, Math.min(1, offsetY / (window.innerHeight / 2)));
            
            // Calculate target tilt and position
            targetTiltX = -normalizedY * maxTilt; // Negative for correct tilt direction
            targetTiltY = normalizedX * maxTilt;
            targetX = normalizedX * maxMove;
            targetY = normalizedY * maxMove;
        }
        
        // Smooth interpolation
        currentTiltX += (targetTiltX - currentTiltX) * smoothing;
        currentTiltY += (targetTiltY - currentTiltY) * smoothing;
        currentX += (targetX - currentX) * smoothing;
        currentY += (targetY - currentY) * smoothing;
        
        // Apply the transform to only the floating layers container
        floatingLayers.style.transform = `
            translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))
            rotateX(${currentTiltX}deg)
            rotateY(${currentTiltY}deg)
            perspective(1000px)
        `;
        
        requestAnimationFrame(animateLayers);
    }
    
    // Mouse tracking - only for hero section
    if (heroSection) {
        heroSection.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseInside = true;
        });
        
        heroSection.addEventListener('mouseenter', function() {
            isMouseInside = true;
        });
        
        heroSection.addEventListener('mouseleave', function() {
            isMouseInside = false;
        });
    }
    
    // Window resize handling
    window.addEventListener('resize', function() {
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2;
    });
    
    // Start the animation
    requestAnimationFrame(animateLayers);
    
    // Button ripple effect
    const contactBtn = document.querySelector('.hero-contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior for demo
            
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                // Reset ripple
                ripple.style.width = '0';
                ripple.style.height = '0';
                ripple.style.opacity = '0';
                
                // Trigger ripple effect
                setTimeout(() => {
                    ripple.style.width = '350px';
                    ripple.style.height = '350px';
                    ripple.style.opacity = '0.8';
                    
                    setTimeout(() => {
                        ripple.style.width = '0';
                        ripple.style.height = '0';
                        ripple.style.opacity = '0';
                    }, 600);
                }, 10);
            }
            
            // Add subtle scale effect to layers on button click
            if (floatingLayers) {
                floatingLayers.style.transition = 'transform 0.2s ease';
                floatingLayers.style.transform += ' scale(1.05)';
                
                setTimeout(() => {
                    floatingLayers.style.transition = '';
                    floatingLayers.style.transform = floatingLayers.style.transform.replace(' scale(1.05)', '');
                }, 200);
            }
        });
    }
});