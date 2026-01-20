document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Intersection Observer for Fade-in Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if you don't want it to fade out again
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));


    // 2. Parallax Scroll Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Parallax for Big Text
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed');
            el.style.transform = `translate(-50%, calc(-50% + ${scrolled * speed}px))`;
        });

        // Parallax for Collection Items (Subtle opposite movement)
        const item2 = document.querySelector('.item-2');
        if(item2) {
             // Simple check to see if it's in view could be added, but for now simple parallax
             // Moving it slightly up faster than scroll to create depth
             // item2.style.transform = `translateY(${-scrolled * 0.05}px)`; 
        }
    });

    // 3. Smooth Scroll Behavior for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});
