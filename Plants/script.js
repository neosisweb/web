// script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-menu-nav');
    const menuClose = document.getElementById('mobile-menu-close');

    if (menuToggle && mobileNav && menuClose) {
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });

        menuClose.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });

        // Close menu when a link is clicked (optional)
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNav.classList.contains('open')) {
                    mobileNav.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // --- Sticky Header on Scroll ---
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Animate Elements on Scroll ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const delay = entry.target.dataset.delay;
                if(delay) {
                    entry.target.style.transitionDelay = delay;
                }
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    };

    if (animatedElements.length > 0) {
        const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        animatedElements.forEach(el => scrollObserver.observe(el));
    }

    // --- Set Current Year in Footer ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

});
