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
  threshold: 0.2 // only trigger when 20% of the box is in view
});

stepBoxes.forEach(box => {
  observer.observe(box);
});
