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


    const points = [
        { x: 0, y: -300 },      // Station 1
        { x: 0, y: -150 },      // Station 2
        { x: 0, y: 0 },         // Station 3
        { x: -100, y: -150 },   // Station 4
        { x: -200, y: -300 },   // Station 5
        { x: -300, y: -150 },   // Station 6
        { x: -400, y: 0 },      // Station 7
        { x: -400, y: -150 },   // Station 8
        { x: -400, y: -300 }    // Station 9
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

    // Scroll-To-Top button logic
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
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
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const targetScroll = (index / (stations.length - 1)) * maxScroll;

            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        });
    });

    // Custom smooth scroll logic mapping window.scrollY to absolute progress
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;

    window.addEventListener('scroll', () => {
        targetScroll = window.scrollY;
        updateScrollToTopVisibility(targetScroll);
    });



    function renderLoop() {
        // Smooth lerping factor
        currentScroll += (targetScroll - currentScroll) * 0.035;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        let absoluteProgress = 0;

        if (maxScroll > 0) {
            absoluteProgress = (currentScroll / maxScroll) * (stations.length - 1);
        }

        const totalSegments = points.length - 1;
        const currentSegment = Math.min(Math.floor(absoluteProgress), totalSegments - 1);
        const segmentProgress = absoluteProgress - currentSegment;

        // Easing function (smoothstep) for softer transitions between stations
        const ease = t => t * t * (3 - 2 * t);
        const easedProgress = ease(segmentProgress);

        const startPoint = points[currentSegment];
        const endPoint = points[currentSegment + 1];

        const currentX = startPoint.x + (endPoint.x - startPoint.x) * easedProgress;
        const currentY = startPoint.y + (endPoint.y - startPoint.y) * easedProgress;

        const world = document.getElementById('canvas-world');
        world.style.transform = `translate3d(${currentX}vw, ${currentY}vh, 0)`;

        dots.forEach((dot, index) => {
            const distance = Math.abs(absoluteProgress - index);

            // Map Dot logic
            if (distance < 0.5) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }

            // Station Content logic (Opacity, Blur & Scale)
            const stationContent = stations[index].querySelector('.station-content');
            if (stationContent) {
                if (distance < 1.0) {
                    stations[index].classList.add('active');
                    stations[index].classList.add('is-visible');

                    const opacity = Math.max(0, 1 - (distance * 1.5));
                    stationContent.style.opacity = opacity.toString();

                    if (distance < 0.2) {
                        stationContent.style.pointerEvents = 'auto';
                    } else {
                        stationContent.style.pointerEvents = 'none';
                    }

                    const blurAmount = distance * 20;
                    stationContent.style.filter = `blur(${blurAmount}px)`;

                    // We remove the crazy custom scales because the dangle animation overrides transform
                    // and we are panning the camera now. We just scale it slightly if it's far.
                    const scale = Math.max(0.8, 1 - (distance * 0.2));
                    // We cannot use transform here directly because it conflicts with the @keyframes dangle
                    // However, wrapping the content in another div to scale would be complex.
                    // Let's use the zoom property as a hack, or rely entirely on camera panning.
                    // For now, let's just rely on the camera panning and opacity/blur!

                } else {
                    stations[index].classList.remove('active');
                    stations[index].classList.remove('is-visible');
                    stationContent.style.opacity = '0';
                    stationContent.style.pointerEvents = 'none';
                    stationContent.style.filter = 'blur(20px)';
                }
            }
        });

        requestAnimationFrame(renderLoop);
    }

    // Start rendering loop
    requestAnimationFrame(renderLoop);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initJournal);
} else {
    initJournal();
}
