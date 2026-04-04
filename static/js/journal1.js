function initJournal() {
    const dots = [
        document.getElementById('map-dot-0'),
        document.getElementById('map-dot-1'),
        document.getElementById('map-dot-2'),
        document.getElementById('map-dot-3'),
        document.getElementById('map-dot-4'),
        document.getElementById('map-dot-5'),
        document.getElementById('map-dot-6'),
        document.getElementById('map-dot-7'),
        document.getElementById('map-dot-8')
    ];

    const stations = [
        document.getElementById('station-1'),
        document.getElementById('station-2'),
        document.getElementById('station-3'),
        document.getElementById('station-4'),
        document.getElementById('station-5'),
        document.getElementById('station-6'),
        document.getElementById('station-7'),
        document.getElementById('station-8'),
        document.getElementById('station-9')
    ];

    const worldContainer = document.getElementById('canvas-world');

    // Scroll-To-Top button logic
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    scrollToTopBtn.addEventListener('click', () => {
        worldContainer.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    function updateScrollToTopVisibility(scrollTop) {
        if (scrollTop > window.innerHeight * 0.5) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.pointerEvents = 'auto';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.pointerEvents = 'none';
            scrollToTopBtn.style.transform = 'translateY(1rem)';
        }
    }

    worldContainer.addEventListener('scroll', () => {
        updateScrollToTopVisibility(worldContainer.scrollTop);
    });

    // --- Draggable Navigation Logic (for the mini-map) ---
    const navOverlay = document.getElementById('nav-overlay');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    navOverlay.addEventListener('mousedown', dragStart);
    navOverlay.addEventListener('touchstart', dragStart, {passive: false});

    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag, {passive: false});
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.map-dot')) {
            return;
        }
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        if (e.target.closest('#nav-overlay')) {
            isDragging = true;
            if(e.type !== "touchstart") e.preventDefault();
        }
    }

    function drag(e) {
        if (isDragging) {
            if (e.type === "touchmove") {
                e.preventDefault();
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, navOverlay);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    // Setup map dots to be clickable and scroll to section
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const station = stations[index];
            if (station) {
                // Determine offset top relative to scroll container
                const offsetTop = station.offsetTop;
                worldContainer.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer to highlight active dot and trigger animations
    const observerOptions = {
        root: worldContainer,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const index = parseInt(id.split('-')[1]) - 1;

                // Add active class to target section
                entry.target.classList.add('is-visible');

                // Update dots
                dots.forEach((dot, i) => {
                    if (i === index) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    stations.forEach(station => {
        if (station) {
            observer.observe(station);
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initJournal);
} else {
    initJournal();
}
