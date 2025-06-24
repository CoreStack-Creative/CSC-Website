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

// Example usage of addWebsiteBox function:
// addWebsiteBox('https://example.com', 'New Project', 'Description of new project');