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

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    
    if (!hamburger || !mobileNav) return;
    
    // Add click event to hamburger
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });
    
    // Close mobile nav when clicking on a link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(event.target) && 
            !hamburger.contains(event.target)) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
});

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize pricing animations if on pricing page
    if (document.querySelector('.pricing-section')) {
        new PricingAnimations();
        new PriceCounter();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    
    // Add click event to hamburger
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });
    
    // Close mobile nav when clicking on a link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(event.target) && 
            !hamburger.contains(event.target)) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
});

// Pricing Section Carousel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const pricingSection = document.querySelector('.pricing-preview-condensed');
    if (!pricingSection) return;

    // Initialize title animation
    initializeTitleAnimation();
    
    // Initialize carousel for mobile
    initializeMobileCarousel();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
});

// Title Animation
function initializeTitleAnimation() {
    const titleWords = document.querySelectorAll('.title-word');
    titleWords.forEach((word, index) => {
        const delay = parseInt(word.dataset.delay) || 0;
        word.style.animationDelay = `${delay}ms`;
    });
}

// Mobile Carousel Functionality
function initializeMobileCarousel() {
    const desktopGrid = document.querySelector('.desktop-grid');
    const mobileCarousel = document.querySelector('.pricing-carousel');
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!desktopGrid || !mobileCarousel || !carouselTrack) return;
    
    let currentSlide = 0;
    const totalSlides = 3;
    
    // Clone cards from desktop grid to mobile carousel
    function populateCarousel() {
        const cards = desktopGrid.querySelectorAll('.pricing-card-wrapper');
        carouselTrack.innerHTML = '';
        
        cards.forEach(card => {
            const clonedCard = card.cloneNode(true);
            // Reset animations for mobile
            clonedCard.style.opacity = '1';
            clonedCard.style.transform = 'none';
            carouselTrack.appendChild(clonedCard);
        });
    }
    
    // Update carousel position
    function updateCarousel() {
        const translateX = -currentSlide * (100 / totalSlides);
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    // Next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateCarousel();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < totalSlides) {
            currentSlide = slideIndex;
            updateCarousel();
        }
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Indicator click events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    const minSwipeDistance = 50;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    carouselTrack.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeDistance = startX - endX;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swiped left - next slide
                nextSlide();
            } else {
                // Swiped right - previous slide
                prevSlide();
            }
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!window.matchMedia('(max-width: 768px)').matches) return;
        
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Initialize carousel
    populateCarousel();
    updateCarousel();
    
    // Auto-advance carousel (optional)
    let autoAdvanceInterval;
    
    function startAutoAdvance() {
        autoAdvanceInterval = setInterval(() => {
            if (currentSlide < totalSlides - 1) {
                nextSlide();
            } else {
                currentSlide = 0;
                updateCarousel();
            }
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoAdvance() {
        if (autoAdvanceInterval) {
            clearInterval(autoAdvanceInterval);
        }
    }
    
    // Start auto-advance on mobile
    if (window.matchMedia('(max-width: 768px)').matches) {
        startAutoAdvance();
        
        // Pause auto-advance when user interacts
        [prevBtn, nextBtn, ...indicators].forEach(element => {
            if (element) {
                element.addEventListener('click', () => {
                    stopAutoAdvance();
                    setTimeout(startAutoAdvance, 10000); // Restart after 10 seconds
                });
            }
        });
        
        // Pause on touch
        carouselTrack.addEventListener('touchstart', stopAutoAdvance);
        carouselTrack.addEventListener('touchend', () => {
            setTimeout(startAutoAdvance, 10000);
        });
    }
}

// Handle window resize
function handleResize() {
    const mobileCarousel = document.querySelector('.pricing-carousel');
    if (!mobileCarousel) return;
    
    // Re-initialize carousel on resize to ensure proper functionality
    setTimeout(() => {
        initializeMobileCarousel();
    }, 100);
}

// Feature list animation delays
function initializeFeatureAnimations() {
    const features = document.querySelectorAll('.features-list li');
    features.forEach((feature, index) => {
        const delay = parseInt(feature.dataset.delay) || (index * 100);
        feature.style.animationDelay = `${delay}ms`;
    });
}

// Button ripple effect
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('select-plan-btn') || e.target.closest('.select-plan-btn')) {
        const button = e.target.classList.contains('select-plan-btn') ? e.target : e.target.closest('.select-plan-btn');
        const ripple = button.querySelector('.btn-ripple');
        
        if (ripple) {
            ripple.style.transform = 'scale(0)';
            setTimeout(() => {
                ripple.style.transform = 'scale(3)';
            }, 10);
            
            setTimeout(() => {
                ripple.style.transform = 'scale(0)';
            }, 500);
        }
    }
});

// Initialize feature animations when section becomes visible
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initializeFeatureAnimations();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    const pricingSection = document.querySelector('.pricing-preview-condensed');
    if (pricingSection) {
        observer.observe(pricingSection);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const cursorBlob = document.querySelector('.cursor-blob');
    const heroSection = document.querySelector('.hero-section');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isMouseInside = false;
    
    // Enhanced smooth interpolation for ultra-fluid movement
    let currentX = 0;
    let currentY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // Slime-like physics constants for viscous movement
    const friction = 0.98; // Very high friction for slow, viscous movement
    const spring = 0.015; // Much lower spring for minimal bounce
    const maxStretch = 1.8; // Reduced stretch for more realistic slime behavior
    const followStrength = 0.25; // Much lower for slow, reluctant following
    
    // Heavy smoothing for slime-like sluggish movement
    let smoothMouseX = mouseX;
    let smoothMouseY = mouseY;
    let ultraSmoothX = mouseX;
    let ultraSmoothY = mouseY;
    const primarySmoothing = 0.05; // Very heavy smoothing
    const secondarySmoothing = 0.03; // Even heavier smoothing
    
    // Enhanced center positioning
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    
    // Performance optimization
    let lastTime = 0;
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;
    
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    function animateBlob(currentTime) {
        // Frame rate control for consistent performance
        if (currentTime - lastTime < frameTime) {
            requestAnimationFrame(animateBlob);
            return;
        }
        lastTime = currentTime;
        
        const time = currentTime * 0.0006;
        
        // Multi-layer mouse smoothing for liquid-like following
        smoothMouseX += (mouseX - smoothMouseX) * primarySmoothing;
        smoothMouseY += (mouseY - smoothMouseY) * primarySmoothing;
        ultraSmoothX += (smoothMouseX - ultraSmoothX) * secondarySmoothing;
        ultraSmoothY += (smoothMouseY - ultraSmoothY) * secondarySmoothing;
        
        if (!isMouseInside) {
            // Very slow return-to-center like thick slime settling
            const returnSpring = 0.008; // Much slower return
            const returnFriction = 0.98; // High friction even when returning
            
            velocityX += (0 - currentX) * returnSpring;
            velocityY += (0 - currentY) * returnSpring;
            velocityX *= returnFriction;
            velocityY *= returnFriction;
            
            currentX += velocityX;
            currentY += velocityY;
            
            // Very slow, gentle breathing animation
            const breathe1 = Math.sin(time * 0.3) * 1.2;
            const breathe2 = Math.cos(time * 0.2) * 1.0;
            const breathe3 = Math.sin(time * 0.4) * 0.8;
            const breathe4 = Math.cos(time * 0.5) * 0.6;
            
            const borderRadius = `${50 + breathe1}% ${50 - breathe2}% ${50 + breathe3}% ${50 - breathe1}% / ${50 - breathe4}% ${50 + breathe2}% ${50 - breathe3}% ${50 + breathe4}%`;
            
            const scale = 1 + Math.sin(time * 0.3) * 0.02;
            
            cursorBlob.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scale(${scale})`;
            cursorBlob.style.borderRadius = borderRadius;
            requestAnimationFrame(animateBlob);
            return;
        }
        
        // Calculate direct movement towards cursor with slime-like resistance
        const targetMouseX = ultraSmoothX;
        const targetMouseY = ultraSmoothY;
        
        // Slime-like reluctant following with heavy resistance
        const directTargetX = (targetMouseX - centerX) * followStrength;
        const directTargetY = (targetMouseY - centerY) * followStrength;
        
        // Minimal target calculation for slow, viscous movement
        targetX = directTargetX;
        targetY = directTargetY;
        
        // Very minimal predictive adjustment (slime doesn't anticipate)
        const mouseVelX = (smoothMouseX - ultraSmoothX) * 0.03;
        const mouseVelY = (smoothMouseY - ultraSmoothY) * 0.03;
        targetX += mouseVelX;
        targetY += mouseVelY;
        
        // Calculate distance for minimal stretching
        const cursorDistance = Math.sqrt(directTargetX * directTargetX + directTargetY * directTargetY);
        const distanceNormalized = Math.min(cursorDistance / (Math.min(window.innerWidth, window.innerHeight) * 0.5), 1);
        
        // Apply slime-like physics - no dynamic changes, just consistent viscosity
        const dynamicSpring = spring; // No variation - consistent slime behavior
        const dynamicFriction = friction;
        
        velocityX += (targetX - currentX) * dynamicSpring;
        velocityY += (targetY - currentY) * dynamicSpring;
        velocityX *= dynamicFriction;
        velocityY *= dynamicFriction;
        
        currentX += velocityX;
        currentY += velocityY;
        
        // Minimal stretch calculation for slime-like behavior
        const maxDistance = Math.min(window.innerWidth, window.innerHeight) * 0.6;
        let stretchFactorBase = Math.min(cursorDistance / maxDistance, 1) * maxStretch;
        
        // Very minimal velocity influence (slime moves slowly)
        const velocityMagnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        const velocityInfluence = Math.min(velocityMagnitude * 0.5, 1); // Much less influence
        stretchFactorBase += velocityInfluence * 0.3; // Minimal velocity stretching
        
        // Direction towards cursor (slow and steady)
        const cursorAngle = Math.atan2(directTargetY, directTargetX);
        const velocityAngle = Math.atan2(velocityY, velocityX);
        
        // Very slow, gentle wave system for slime-like deformation
        const time1 = time * 0.2;
        const time2 = time * 0.15;
        const time3 = time * 0.1;
        
        const wave1 = Math.sin(time1 + cursorDistance * 0.003) * 2;
        const wave2 = Math.cos(time2 + cursorDistance * 0.002) * 1.8;
        const wave3 = Math.sin(time3 + cursorDistance * 0.004) * 1.5;
        const wave4 = Math.cos(time1 * 0.8 + cursorDistance * 0.0025) * 1.2;
        const wave5 = Math.sin(time2 * 0.6 + cursorDistance * 0.0035) * 1;
        const wave6 = Math.cos(time3 * 0.9 + cursorDistance * 0.002) * 0.8;
        
        // VOLUME-PRESERVING STRETCH: Minimal stretch for slime behavior
        const horizontalStretch = 1 + Math.abs(Math.cos(cursorAngle)) * stretchFactorBase * 0.7;
        const verticalStretch = 1 + Math.abs(Math.sin(cursorAngle)) * stretchFactorBase * 0.7;
        
        // Preserve volume by inverse scaling
        const volumePreservationFactor = 1 / Math.sqrt(horizontalStretch * verticalStretch);
        const finalHorizontalStretch = horizontalStretch * volumePreservationFactor;
        const finalVerticalStretch = verticalStretch * volumePreservationFactor;
        
        // Minimal velocity-based stretching for slime movement feedback
        const movementAngle = Math.atan2(velocityY, velocityX);
        const directionalStretchX = 1 + Math.abs(Math.cos(movementAngle)) * velocityInfluence * 0.2;
        const directionalStretchY = 1 + Math.abs(Math.sin(movementAngle)) * velocityInfluence * 0.2;
        
        // Apply volume preservation to directional stretch
        const directionalVolumePreservation = 1 / Math.sqrt(directionalStretchX * directionalStretchY);
        const finalDirectionalStretchX = directionalStretchX * directionalVolumePreservation;
        const finalDirectionalStretchY = directionalStretchY * directionalVolumePreservation;
        
        // Combine stretch effects with minimal blending for slime consistency
        const combinedStretchX = finalHorizontalStretch * finalDirectionalStretchX;
        const combinedStretchY = finalVerticalStretch * finalDirectionalStretchY;
        
        // Final volume preservation
        const finalVolumePreservation = 1 / Math.sqrt(combinedStretchX * combinedStretchY);
        const stretchX = combinedStretchX * finalVolumePreservation;
        const stretchY = combinedStretchY * finalVolumePreservation;
        
        // Create gentle, slime-like border radius
        const baseRadius = 50;
        const stretchInfluence = (stretchX + stretchY - 2) * 8; // Reduced influence for subtlety
        
        const flowRadius1 = baseRadius + wave1 + stretchInfluence * Math.cos(cursorAngle);
        const flowRadius2 = baseRadius + wave2 + stretchInfluence * Math.sin(cursorAngle);
        const flowRadius3 = baseRadius + wave3 + stretchInfluence * Math.cos(cursorAngle + Math.PI);
        const flowRadius4 = baseRadius + wave4 + stretchInfluence * Math.sin(cursorAngle + Math.PI);
        const flowRadius5 = baseRadius + wave5 + stretchInfluence * Math.cos(cursorAngle + Math.PI * 0.5);
        const flowRadius6 = baseRadius + wave6 + stretchInfluence * Math.sin(cursorAngle + Math.PI * 0.5);
        const flowRadius7 = baseRadius - wave1 + stretchInfluence * Math.cos(cursorAngle + Math.PI * 1.5);
        const flowRadius8 = baseRadius - wave2 + stretchInfluence * Math.sin(cursorAngle + Math.PI * 1.5);
        
        const borderRadius = `${flowRadius1}% ${flowRadius2}% ${flowRadius3}% ${flowRadius4}% / ${flowRadius5}% ${flowRadius6}% ${flowRadius7}% ${flowRadius8}%`;
        
        // Very minimal rotation for slime-like sluggish behavior
        const rotation = cursorAngle * 0.008 + Math.sin(time * 0.15) * 0.005;
        
        // Apply volume-preserving stretch transformation
        cursorBlob.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scale(${stretchX}, ${stretchY}) rotate(${rotation}rad)`;
        cursorBlob.style.borderRadius = borderRadius;
        
        requestAnimationFrame(animateBlob);
    }
    
    // Enhanced mouse tracking with sub-pixel precision
    heroSection.addEventListener('mousemove', function(e) {
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left + rect.left;
        mouseY = e.clientY - rect.top + rect.top;
        isMouseInside = true;
    });
    
    heroSection.addEventListener('mouseenter', function() {
        isMouseInside = true;
    });
    
    heroSection.addEventListener('mouseleave', function() {
        isMouseInside = false;
    });
    
    // Smooth window resize handling
    window.addEventListener('resize', function() {
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2;
        if (!isMouseInside) {
            mouseX = centerX;
            mouseY = centerY;
            smoothMouseX = centerX;
            smoothMouseY = centerY;
            ultraSmoothX = centerX;
            ultraSmoothY = centerY;
        }
    });
    
    // Start the enhanced animation
    requestAnimationFrame(animateBlob);
    
    // Enhanced button ripple effect
    const contactBtn = document.querySelector('.hero-contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                ripple.style.width = '350px';
                ripple.style.height = '350px';
                ripple.style.opacity = '0.8';
                
                setTimeout(() => {
                    ripple.style.width = '0';
                    ripple.style.height = '0';
                    ripple.style.opacity = '0';
                }, 600);
            }
        });
    }
});