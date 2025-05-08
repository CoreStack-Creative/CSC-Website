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