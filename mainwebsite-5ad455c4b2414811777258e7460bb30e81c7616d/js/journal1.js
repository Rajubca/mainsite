function initJournal() {
    const world = document.getElementById('main-scroller');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    const dots = Array.from(document.querySelectorAll('.map-dot'));
    const stations = Array.from(document.querySelectorAll('.station'));

    // Intersection Observer for sections
    const observerOptions = {
        root: world,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const index = stations.indexOf(entry.target);

            if (entry.isIntersecting) {
                // Set active states
                entry.target.classList.add('active');

                dots.forEach((dot, i) => {
                    if (i === index) dot.classList.add('active');
                    else dot.classList.remove('active');
                });

                // Add animation classes or styles for the content
                const content = entry.target.querySelector('.station-content');
                if (content) {
                    content.style.opacity = '1';
                    content.style.transform = 'scale(1)';
                    content.style.filter = 'none';
                    content.style.pointerEvents = 'auto';
                }
            } else {
                // Remove active states
                entry.target.classList.remove('active');

                const content = entry.target.querySelector('.station-content');
                if (content) {
                    content.style.opacity = '0';
                    content.style.transform = 'scale(0.95)';
                    content.style.pointerEvents = 'none';

                    // Special case for wellness station
                    if (index === 6) {
                        content.style.filter = 'blur(10px)';
                    }
                }
            }
        });
    }, observerOptions);

    // Observe all stations and initialize their state
    stations.forEach(station => {
        const content = station.querySelector('.station-content');
        if (content) {
            content.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            content.style.opacity = '0';
            content.style.transform = 'scale(0.95)';
        }
        observer.observe(station);
    });

    // Handle scroll progress
    world.addEventListener('scroll', () => {
        const maxScroll = world.scrollHeight - world.clientHeight;
        if (maxScroll <= 0) return;

        const progress = Math.min(Math.max(world.scrollTop / maxScroll, 0), 1);

        if (scrollProgressBar) {
            scrollProgressBar.style.height = `${progress * 100}%`;
        }

        if (scrollToTopBtn) {
            if (progress > 0.1) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.pointerEvents = 'auto';
                scrollToTopBtn.style.transform = 'translateY(0)';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.pointerEvents = 'none';
                scrollToTopBtn.style.transform = 'translateY(1rem)';
            }
        }
    });

    // Map Dot Navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stations[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Scroll to Top
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            world.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Initial Trigger
    world.dispatchEvent(new Event('scroll'));
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initJournal);
} else {
    initJournal();
}
