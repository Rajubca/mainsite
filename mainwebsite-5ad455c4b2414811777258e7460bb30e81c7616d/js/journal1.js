function initJournal() {
    const dots = Array.from(document.querySelectorAll('.map-dot'));
    const stations = Array.from(document.querySelectorAll('.station'));
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');

    // Initialize Swiper
    const swiper = new Swiper('.mySwiper', {
        direction: 'vertical',
        mousewheel: true,
        keyboard: {
            enabled: true,
        },
        speed: 800,
        on: {
            init: function () {
                updateActiveState(this.activeIndex);
            },
            slideChange: function () {
                updateActiveState(this.activeIndex);
            },
            progress: function (swiper, progress) {
                // Update scroll progress bar based on Swiper progress
                if (scrollProgressBar) {
                    scrollProgressBar.style.height = `${progress * 100}%`;
                }
            }
        }
    });

    function updateActiveState(activeIndex) {
        // Update dots
        dots.forEach((dot, i) => {
            if (i === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update stations (animations and active class)
        stations.forEach((station, i) => {
            const content = station.querySelector('.station-content');
            if (!content) return;

            // Set transitions for smooth animations
            content.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';

            if (i === activeIndex) {
                station.classList.add('active');
                content.style.opacity = '1';
                content.style.transform = 'scale(1)';
                content.style.filter = 'none';
                content.style.pointerEvents = 'auto';
            } else {
                station.classList.remove('active');
                content.style.opacity = '0';
                content.style.transform = 'scale(0.95)';
                content.style.pointerEvents = 'none';

                // Restore special case for wellness station (index 6) from original code
                if (i === 6) {
                    content.style.filter = 'blur(10px)';
                } else {
                    content.style.filter = 'none';
                }
            }
        });

        // Toggle scroll to top button
        if (scrollToTopBtn) {
            if (activeIndex > 0) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.pointerEvents = 'auto';
                scrollToTopBtn.style.transform = 'translateY(0)';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.pointerEvents = 'none';
                scrollToTopBtn.style.transform = 'translateY(1rem)';
            }
        }
    }

    // Map Dot Click Handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            swiper.slideTo(index);
        });
    });

    // Scroll to Top Click Handler
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            swiper.slideTo(0);
        });
    }
}

// Ensure DOM is fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJournal);
} else {
    initJournal();
}
