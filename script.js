// script.js (with Firebase Form Submission for Local Testing)

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const customCursor = document.querySelector('.custom-cursor');
    const customCursorDot = document.querySelector('.custom-cursor-dot');
    const hoverTargets = document.querySelectorAll('.hover-target');
    const mainHeader = document.getElementById('main-header');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const animatedElements = document.querySelectorAll('.opacity-0[class*="animate-"]');
    
    const appointmentForm = document.getElementById('appointmentForm');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnText = submitBtn ? submitBtn.querySelector('.submit-text') : null;
    const loadingSpinner = submitBtn ? submitBtn.querySelector('.loading-spinner') : null;

    // --- Firebase Initialization ---
    let db;
    let auth;
    // These are expected to be populated by the inline script in contact.html
    const firebaseConfig = window.firebaseConfigForApp; 
    const initialAuthToken = window.initialAuthTokenForApp; // Will be null for local testing
    const appId = window.appIdForApp; // The app ID for Firestore path

    // Check if firebase is available (it should be, from the SDKs in contact.html)
    if (typeof firebase !== 'undefined' && firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE_IF_NOT_IN_CANVAS") {
        try {
            // Use compat libraries
            if (!firebase.apps.length) { 
                 firebase.initializeApp(firebaseConfig);
                 console.log("Firebase initialized.");
            } else {
                 firebase.app(); 
                 console.log("Firebase already initialized, using existing app.");
            }
            db = firebase.firestore();
            auth = firebase.auth();
            // Firebase services are ready to use

            // Sign in (anonymously or with custom token if provided by Canvas)
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    console.log("User is signed in:", user.uid);
                } else {
                    console.log("No user signed in. Attempting sign-in...");
                    if (initialAuthToken) { // This path is more for Canvas environment
                        try {
                            await auth.signInWithCustomToken(initialAuthToken);
                            console.log("Signed in with custom token.");
                        } catch (error) {
                            console.error("Error signing in with custom token:", error.code, error.message);
                            // Fallback to anonymous if custom token fails
                            try {
                                await auth.signInAnonymously();
                                console.log("Signed in anonymously after custom token failure.");
                            } catch (anonError) {
                                console.error("Error signing in anonymously:", anonError.code, anonError.message);
                            }
                        }
                    } else { // For local testing, initialAuthToken will be null, so sign in anonymously
                        try {
                            await auth.signInAnonymously();
                            console.log("Signed in anonymously.");
                        } catch (error) {
                            console.error("Error signing in anonymously:", error.code, error.message);
                        }
                    }
                }
            });

        } catch (error) {
            console.error("Error initializing Firebase:", error);
            if (formMessage && window.location.pathname.includes('contact.html')) {
                formMessage.textContent = "Error initializing application services. Please try again later.";
                formMessage.className = 'mt-4 text-sm text-center text-red-600';
            }
        }
    } else {
        console.warn("Firebase config is not fully provided or Firebase SDK not loaded. Form submission to Firebase will not work.");
        if (formMessage && window.location.pathname.includes('contact.html')) { 
             formMessage.textContent = "Contact form is currently not connected. Please ensure Firebase is configured correctly.";
             formMessage.className = 'mt-4 text-sm text-center text-orange-600';
        }
         if (submitBtn) submitBtn.disabled = true; // Disable form if Firebase isn't ready
    }


    // --- 1. Custom Cursor Logic ---
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    const cursorSpeed = 0.1;

    if (customCursor && customCursorDot) {
        window.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        const animateCursor = () => {
            const distX = cursorX - dotX;
            const distY = cursorY - dotY;
            dotX += distX * cursorSpeed;
            dotY += distY * cursorSpeed;
            customCursor.style.left = `${cursorX}px`;
            customCursor.style.top = `${cursorY}px`;
            customCursorDot.style.left = `${dotX}px`;
            customCursorDot.style.top = `${dotY}px`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                customCursor.classList.add('hovered');
                if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.classList.contains('nav-link')) {
                    customCursor.classList.add('text-hovered');
                }
                if (target.closest('.on-dark-section, .bg-pure-black, .bg-accent-gray, footer')) {
                    customCursor.style.borderColor = 'var(--cursor-color-inverted)';
                    customCursorDot.style.backgroundColor = 'var(--cursor-color-inverted)';
                } else {
                    customCursor.style.borderColor = 'var(--cursor-color-default)';
                    customCursorDot.style.backgroundColor = 'var(--cursor-color-default)';
                }
            });
            target.addEventListener('mouseleave', () => {
                customCursor.classList.remove('hovered');
                customCursor.classList.remove('text-hovered');
                customCursor.style.borderColor = 'var(--cursor-color-default)';
                customCursorDot.style.backgroundColor = 'var(--cursor-color-default)';
            });
        });

        document.addEventListener('mouseleave', () => {
            if (customCursor) customCursor.style.opacity = '0';
            if (customCursorDot) customCursorDot.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            if (customCursor) customCursor.style.opacity = '1';
            if (customCursorDot) customCursorDot.style.opacity = '1';
        });
    }

    // --- 2. Mobile Menu Toggle ---
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.setAttribute('aria-hidden', isExpanded);
        });
    }

    // --- 3. Scroll-Triggered Animations ---
    if (animatedElements.length > 0) {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, observerOptions);
        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            animationObserver.observe(el);
        });
    }

    // --- 4. Header Scroll Effect ---
    if (mainHeader) {
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        });
    }
    
    // --- 5. Contact Form Submission to Firebase ---
    if (appointmentForm) { 
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!submitBtn || !formMessage || !submitBtnText || !loadingSpinner) {
                console.error("Form UI elements not found.");
                return;
            }
            
            // Check if Firebase is ready before proceeding
            if (!db || !auth) {
                console.error("Firebase (db or auth) not initialized. Cannot submit form.");
                formMessage.textContent = "Form submission service is not ready. Please try again in a moment.";
                formMessage.className = 'mt-4 text-sm text-center text-orange-600';
                return;
            }


            submitBtn.disabled = true;
            submitBtnText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
            formMessage.textContent = '';
            formMessage.className = 'mt-4 text-sm text-center';


            const name = appointmentForm.name.value.trim();
            const email = appointmentForm.email.value.trim();
            const phone = appointmentForm.phone.value.trim();
            const service = appointmentForm.service.value;
            const message = appointmentForm.message.value.trim();
            const submissionTime = firebase.firestore.FieldValue.serverTimestamp(); // Use compat syntax

            if (!name || !email || !message) {
                formMessage.textContent = 'Please fill in all required fields.';
                formMessage.className = 'mt-4 text-sm text-center text-red-600';
                submitBtn.disabled = false;
                submitBtnText.classList.remove('hidden');
                loadingSpinner.classList.add('hidden');
                return;
            }
            
            const currentUser = auth.currentUser;
            const userId = currentUser ? currentUser.uid : 'anonymous_submission';
            // Using the public path structure as per instructions for shared apps
            // appId should be available from window.appIdForApp set in contact.html
            const collectionPath = `/artifacts/${appId}/public/data/contactSubmissions`;
            console.log("Submitting to Firestore collection:", collectionPath);

            try {
                await db.collection(collectionPath).add({
                    name: name,
                    email: email,
                    phone: phone,
                    service: service,
                    message: message,
                    submittedAt: submissionTime,
                    userId: userId, 
                    status: 'new' 
                });
                formMessage.textContent = 'Thank you! Your message has been sent successfully.';
                formMessage.className = 'mt-4 text-sm text-center text-green-600';
                appointmentForm.reset();
            } catch (error) {
                console.error("Error adding document to Firestore: ", error);
                formMessage.textContent = 'Sorry, there was an error sending your message. Please try again later.';
                formMessage.className = 'mt-4 text-sm text-center text-red-600';
            } finally {
                submitBtn.disabled = false;
                submitBtnText.classList.remove('hidden');
                loadingSpinner.classList.add('hidden');
            }
        });
    }


    // --- 6. Dynamic Footer Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Custom Smooth Scrolling Function ---
    const scrollDuration = 1000; 
    function customSmoothScroll(targetSelector, duration) {
        const targetElement = document.querySelector(targetSelector);
        if (!targetElement) return;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        function easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        requestAnimationFrame(animation);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute && hrefAttribute.length > 1 && hrefAttribute.startsWith("#")) {
                e.preventDefault();
                customSmoothScroll(hrefAttribute, scrollDuration);
                if (mobileMenu && !mobileMenu.classList.contains('hidden') && anchor.closest('#mobile-menu')) {
                    mobileMenu.classList.add('hidden');
                    if(mobileMenuButton) mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav a.nav-link');
    function changeNavOnScroll() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (mainHeader && pageYOffset >= sectionTop - mainHeader.offsetHeight - 50 && pageYOffset < sectionTop + sectionHeight - mainHeader.offsetHeight - 50) {
                currentSectionId = section.getAttribute('id');
            }
        });
        if (!currentSectionId && pageYOffset < window.innerHeight / 2) {
             currentSectionId = 'hero';
        }
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            const linkHash = linkHref.includes('#') ? linkHref.substring(linkHref.lastIndexOf('#') + 1) : null;
            if (linkHref === 'index.html' && (currentSectionId === 'hero' || ((window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')) && !currentSectionId && pageYOffset < 200 ))) {
                 link.classList.add('active');
            } else if (linkHref === 'contact.html' && window.location.pathname.includes('contact.html')) { // Specific for contact page
                link.classList.add('active');
            } else if (linkHash && linkHash === currentSectionId) {
                link.classList.add('active');
            } else if (linkHref === `${currentSectionId}.html`) {
                 link.classList.add('active');
            }
        });
        if (mainHeader && sections.length > 0 && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html'))) {
            if (pageYOffset < sections[0].offsetTop - mainHeader.offsetHeight - 50) { 
                navLinks.forEach(link => link.classList.remove('active'));
                const homeLink = document.querySelector('header nav a.nav-link[href="index.html"]');
                if (homeLink) homeLink.classList.add('active');
            }
        }
    }
    if (mainHeader && sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', changeNavOnScroll);
        changeNavOnScroll(); 
    }

}); // End DOMContentLoaded
