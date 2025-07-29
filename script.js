document.addEventListener('DOMContentLoaded', function () {
    // ===== NAVBAR SCROLL EFFECT - IMPROVED VERSION =====
    const nav = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    
    // Enhanced navbar scroll handler
    function handleNavbarScroll() {
        if (!nav) return;
        
        const scrollThreshold = window.innerHeight * 0.1; // 10% of viewport height
        
        if (window.scrollY > scrollThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    
    // Initialize navbar scroll effect with multiple methods for reliability
    if (nav && hero) {
        // Method 1: Scroll event listener (primary)
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            // Throttle scroll events for better performance
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(handleNavbarScroll, 10);
        }, { passive: true });
        
        // Method 2: Intersection Observer (backup)
        const navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    nav.classList.remove('scrolled');
                } else {
                    nav.classList.add('scrolled');
                }
            });
        }, {
            root: null,
            rootMargin: '-10% 0px 0px 0px', // Trigger when hero is 10% out of view
            threshold: 0
        });
        
        navObserver.observe(hero);
        
        // Initial check on page load
        handleNavbarScroll();
        
        // Re-check on window resize
        window.addEventListener('resize', handleNavbarScroll);
    }

    // ===== HERO CAROUSEL FUNCTIONALITY =====
    let currentHeroSlide = 0;
    const heroSlides = document.querySelectorAll('.hero-content');
    const heroIndicators = document.querySelectorAll('.carousel-indicators button');
    const totalHeroSlides = heroSlides.length;

    if (heroSlides.length > 0) {
        function showHeroSlide(index) {
            heroSlides.forEach((slide, i) => {
                slide.classList.remove('active', 'fade-in-up');
                slide.style.display = 'none';
            });
            
            if (heroIndicators.length > 0) {
                heroIndicators.forEach(indicator => indicator.classList.remove('active'));
                heroIndicators[index].classList.add('active');
            }

            const current = heroSlides[index];
            current.classList.add('active', 'fade-in-up');
            current.style.display = 'block';
            currentHeroSlide = index;
        }

        function nextHeroSlide() {
            const next = (currentHeroSlide + 1) % totalHeroSlides;
            showHeroSlide(next);
        }

        let heroCarouselInterval;
        function startHeroCarousel() {
            heroCarouselInterval = setInterval(nextHeroSlide, 5000);
        }

        function stopHeroCarousel() {
            clearInterval(heroCarouselInterval);
        }

        // Hero indicators click events
        heroIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => showHeroSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                const prev = currentHeroSlide === 0 ? totalHeroSlides - 1 : currentHeroSlide - 1;
                showHeroSlide(prev);
            } else if (e.key === 'ArrowRight') {
                nextHeroSlide();
            }
        });

        // Touch navigation
        if (hero) {
            let startX = 0, endX = 0;
            hero.addEventListener('touchstart', function (e) {
                startX = e.touches[0].clientX;
            });

            hero.addEventListener('touchend', function (e) {
                endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) nextHeroSlide();
                    else {
                        const prev = currentHeroSlide === 0 ? totalHeroSlides - 1 : currentHeroSlide - 1;
                        showHeroSlide(prev);
                    }
                }
            });

            hero.addEventListener('mouseenter', stopHeroCarousel);
            hero.addEventListener('mouseleave', startHeroCarousel);
        }

        // Initialize hero carousel
        heroSlides.forEach(slide => slide.style.display = 'none');
        showHeroSlide(0);
        startHeroCarousel();
    }

    // ===== WORK SECTION SLIDESHOW =====
    let currentWorkSlide = 0;
    const workSlides = document.querySelectorAll('.slide');
    const totalWorkSlides = workSlides.length;

    if (workSlides.length > 0) {
        function showWorkSlide(index) {
            workSlides.forEach(slide => slide.classList.remove('active'));
            workSlides[index].classList.add('active');
            currentWorkSlide = index;
        }

        function changeWorkSlide(direction) {
            currentWorkSlide += direction;
            
            if (currentWorkSlide >= totalWorkSlides) {
                currentWorkSlide = 0;
            }
            if (currentWorkSlide < 0) {
                currentWorkSlide = totalWorkSlides - 1;
            }
            
            showWorkSlide(currentWorkSlide);
        }

        function autoWorkSlide() {
            currentWorkSlide = (currentWorkSlide + 1) % totalWorkSlides;
            showWorkSlide(currentWorkSlide);
        }

        const prevButtons = document.querySelectorAll('.prev');
        const nextButtons = document.querySelectorAll('.next');
        
        prevButtons.forEach(btn => {
            btn.addEventListener('click', () => changeWorkSlide(-1));
        });
        
        nextButtons.forEach(btn => {
            btn.addEventListener('click', () => changeWorkSlide(1));
        });

        let workSlideInterval = setInterval(autoWorkSlide, 5000);

        const workContainer = document.querySelector('.slideshow-container');
        if (workContainer) {
            workContainer.addEventListener('mouseenter', () => {
                clearInterval(workSlideInterval);
            });

            workContainer.addEventListener('mouseleave', () => {
                workSlideInterval = setInterval(autoWorkSlide, 5000);
            });
        }
    }

    // ===== TESTIMONIAL SLIDESHOW =====
    let testimonialSlideIndex = 1;
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.dot');
    const totalTestimonialSlides = testimonialSlides.length;

    if (testimonialSlides.length > 0) {
        function currentTestimonialSlide(n) {
            showTestimonialSlide(testimonialSlideIndex = n);
        }

        function showTestimonialSlide(n) {
            if (n > totalTestimonialSlides) { testimonialSlideIndex = 1; }
            if (n < 1) { testimonialSlideIndex = totalTestimonialSlides; }

            testimonialSlides.forEach(slide => slide.classList.remove('active'));
            testimonialDots.forEach(dot => dot.classList.remove('active'));

            testimonialSlides[testimonialSlideIndex - 1].classList.add('active');
            if (testimonialDots.length > 0) {
                testimonialDots[testimonialSlideIndex - 1].classList.add('active');
            }
        }

        function autoTestimonialSlide() {
            testimonialSlideIndex++;
            if (testimonialSlideIndex > totalTestimonialSlides) { testimonialSlideIndex = 1; }
            showTestimonialSlide(testimonialSlideIndex);
        }

        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => currentTestimonialSlide(index + 1));
        });

        let testimonialInterval = setInterval(autoTestimonialSlide, 5000);

        const testimonialContainer = document.querySelector('.testimonial-container');
        if (testimonialContainer) {
            testimonialContainer.addEventListener('mouseenter', () => {
                clearInterval(testimonialInterval);
            });

            testimonialContainer.addEventListener('mouseleave', () => {
                testimonialInterval = setInterval(autoTestimonialSlide, 5000);
            });
        }
    }

    // ===== GALLERY ISOTOPE FUNCTIONALITY =====
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer && typeof Isotope !== 'undefined') {
        const iso = new Isotope('.gallery-container', {
            itemSelector: '.gallery-item',
            layoutMode: 'fitRows',
            transitionDuration: '0.6s'
        });

        const filters = document.querySelectorAll('#gallery-flters li');
        filters.forEach(filter => {
            filter.addEventListener('click', function () {
                filters.forEach(el => el.classList.remove('filter-active'));
                this.classList.add('filter-active');

                const filterValue = this.getAttribute('data-filter');
                iso.arrange({ filter: filterValue });
            });
        });
    }

    // ===== SCROLL FUNCTIONALITY =====
    const scrollBtn = document.querySelector('.scroll-indicator');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', function () {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }

    // ===== WINDOW RESIZE HANDLER =====
    window.addEventListener('resize', function () {
        const activeSlide = document.querySelector('.hero-content.active');
        if (activeSlide) {
            activeSlide.style.transform = 'translate(-50%, -50%) translateY(0)';
        }
        // Re-check navbar scroll on resize
        handleNavbarScroll();
    });

    // ===== AOS COMPATIBILITY =====
    // Initialize AOS if it exists
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            disable: function() {
                // Disable on mobile if needed
                return window.innerWidth < 768;
            }
        });
        
        // Refresh AOS after dynamic content changes
        setTimeout(() => {
            AOS.refresh();
        }, 100);
    }
});

// ===== GLOBAL FUNCTIONS FOR INLINE ONCLICK EVENTS =====
function currentSlide(n) {
    if (typeof currentTestimonialSlide === 'function') {
        currentTestimonialSlide(n);
    }
}

function changeSlide(direction) {
    if (typeof changeWorkSlide === 'function') {
        changeWorkSlide(direction);
    }
}

// ===== UTILITY FUNCTIONS FOR AOS COMPATIBILITY =====
// Function to safely refresh AOS without breaking navbar
function refreshAOS() {
    if (typeof AOS !== 'undefined') {
        setTimeout(() => {
            AOS.refresh();
        }, 100);
    }
}

// Function to reinitialize navbar scroll after AOS loads
function reinitializeNavbar() {
    const nav = document.querySelector('.navbar');
    if (nav) {
        // Force a scroll check
        const scrollEvent = new Event('scroll');
        window.dispatchEvent(scrollEvent);
    }
}