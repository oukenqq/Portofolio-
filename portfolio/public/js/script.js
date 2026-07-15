// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar__link');

function setActiveLink() {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('navbar__link--active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('navbar__link--active');
    }
  });
}

window.addEventListener('scroll', setActiveLink);
setActiveLink();

// Scroll Progress Bar
const scrollProgressBar = document.getElementById('scrollProgressBar');

function updateScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  if (scrollProgressBar) {
    scrollProgressBar.style.width = `${scrollPercentage}%`;
  }
}

window.addEventListener('scroll', updateScrollProgress);
updateScrollProgress();

// Magnetic Button Effect for "Say Hello" button
const sayHelloBtn = document.getElementById('sayHelloBtn');

if (sayHelloBtn) {
  document.addEventListener('mousemove', (e) => {
    const rect = sayHelloBtn.getBoundingClientRect();
    
    // Center of the button
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;
    
    // Mouse coordinates relative to viewport
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Distance calculation
    const dx = mouseX - btnX;
    const dy = mouseY - btnY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const triggerRadius = 80; // 60-80px radius
    const maxDisplacement = 12; // 10-15px max offset
    
    if (distance < triggerRadius) {
      // Interpolate factor: 0 at boundary (smooth transition), 1 at center
      const ratio = (triggerRadius - distance) / triggerRadius;
      
      // Calculate direction angle
      const angle = Math.atan2(dy, dx);
      
      // Calculate target translate offset
      const targetX = Math.cos(angle) * maxDisplacement * ratio;
      const targetY = Math.sin(angle) * maxDisplacement * ratio;
      
      // Apply translate and scale-up when active
      sayHelloBtn.style.transform = `translate(${targetX}px, ${targetY}px) scale(1.05)`;
    } else {
      // Smoothly return to original state
      sayHelloBtn.style.transform = '';
    }
  });

  document.addEventListener('mouseleave', () => {
    sayHelloBtn.style.transform = '';
  });
}

// Intersection Observer for Project Cards scroll reveal animation
document.addEventListener('DOMContentLoaded', () => {
  const projectCards = document.querySelectorAll('.project-card');

  if (projectCards.length > 0) {
    const projectObserverOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const projectObserver = new IntersectionObserver((entries, observer) => {
      let delayCounter = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          
          // Apply stagger transition delay only for elements appearing in the same viewport scan
          card.style.transitionDelay = `${delayCounter * 120}ms`;
          card.classList.add('project-card--visible');
          
          // Stop observing the card since it is now permanently revealed
          observer.unobserve(card);
          delayCounter++;
          
          // Reset the inline transitionDelay after the 0.8s transition completes to avoid hover delay conflicts
          setTimeout(() => {
            card.style.transitionDelay = '';
          }, 800 + (delayCounter * 120));
        }
      });
    }, projectObserverOptions);

    projectCards.forEach((card) => {
      projectObserver.observe(card);

      // Interactive 3D Tilt Effect
      card.addEventListener('mousemove', (e) => {
        // Ensure the card is visible before applying hover tilt effects
        if (!card.classList.contains('project-card--visible')) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the card
        const y = e.clientY - rect.top;  // y position within the card
        
        const width = rect.width;
        const height = rect.height;
        
        // Map coordinate positions to values between -1 and 1
        const xNorm = (x / width) * 2 - 1;
        const yNorm = (y / height) * 2 - 1;
        
        // Setup tilt thresholds (subtle 8-degree maximum for a professional aesthetic)
        const maxTilt = 8;
        const tiltX = -yNorm * maxTilt; // Up/down tilt
        const tiltY = xNorm * maxTilt;  // Left/right tilt
        
        // Set transform with perspective, rotating around X & Y axes, shifting up, and scaling slightly
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.025)`;
        card.style.boxShadow = '0 24px 48px -12px rgba(0,0,0,0.65)';
        card.style.transition = 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.25s ease-out';
      });

      card.addEventListener('mouseleave', () => {
        // Smoothly animate back to resting state
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  // Scroll Reveal Observer for About & Contact Sections
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

  if (scrollRevealElements.length > 0) {
    const revealObserverOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, revealObserverOptions);

    scrollRevealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // ===================== CUSTOM CIRCULAR CURSOR =====================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHidden = true;

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (isHidden) {
        isHidden = false;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }
    });

    // Smooth lerp follow loop
    function updateCursor() {
      // Lerp rate (0.15 for smooth lag/delay effect)
      const lerpFactor = 0.15;
      
      // Smooth follow for the ring
      ringX += (mouseX - ringX) * lerpFactor;
      ringY += (mouseY - ringY) * lerpFactor;

      // Direct movement for the dot
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(updateCursor);
    }
    
    // Start the animation loop
    requestAnimationFrame(updateCursor);

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      isHidden = true;
    });

    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
      isHidden = false;
    });

    // Add hover class on interactive elements
    const interactiveSelector = 'a, button, .btn, .project-card, .facts-panel__item, .navbar__logo, .navbar__link, .contact__link';
    
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) {
        document.body.classList.add('custom-cursor--hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) {
        // Check if we are still hovering inside another interactive element
        if (!e.relatedTarget || !e.relatedTarget.closest(interactiveSelector)) {
          document.body.classList.remove('custom-cursor--hover');
        }
      }
    });
  }
});
