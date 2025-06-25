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