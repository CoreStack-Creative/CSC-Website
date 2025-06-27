document.addEventListener("DOMContentLoaded", () => {
  let lastScrollY = window.scrollY;
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      // Scrolling down – hide the header completely
      header.classList.add("hidden");
      header.classList.remove("faded");
    } else {
      // Scrolling up – show the header
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
  threshold: 0.1 // only trigger when 20% of the box is in view
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
// Example usage of addWebsiteBox function:
// addWebsiteBox('https://example.com', 'New Project', 'Description of new project'); 

// Pricing Section Professional Animations
// Pricing Section Advanced Animations
// Pricing Section Professional Animations
class PricingAnimations {
  constructor() {
    this.particles = [];
    this.init();
  }

  init() {
    this.createSubtleParticles();
    this.setupIntersectionObserver();
    this.animateTitleWords();
    this.animateFeatureItems();
    this.setupCardHoverEffects();
    this.setupButtonRippleEffect// Pricing Section Advanced Animations
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
      const delay = parseInt(word.dataset.delay);
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

//

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