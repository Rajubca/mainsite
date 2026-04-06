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

    // State
    let currentStationIndex = 0; // The integer index (0-8) we are heading towards
    let currentProgress = 0.0;   // The float representing our lerped position (0.0 - 8.0)

    // Elements
    const btnNext = document.getElementById('nav-next');
    const btnPrev = document.getElementById('nav-prev');

    function updateButtonStates() {
        if (currentStationIndex === 0) {
            btnPrev.classList.add('opacity-50', 'cursor-not-allowed');
            btnPrev.classList.remove('hover:scale-110');
        } else {
            btnPrev.classList.remove('opacity-50', 'cursor-not-allowed');
            btnPrev.classList.add('hover:scale-110');
        }

        if (currentStationIndex === stations.length - 1) {
            btnNext.classList.add('opacity-50', 'cursor-not-allowed');
            btnNext.classList.remove('hover:scale-110');
        } else {
            btnNext.classList.remove('opacity-50', 'cursor-not-allowed');
            btnNext.classList.add('hover:scale-110');
        }
    }

    // Navigation Buttons
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (currentStationIndex < stations.length - 1) {
                currentStationIndex++;
                updateButtonStates();
            }
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentStationIndex > 0) {
                currentStationIndex--;
                updateButtonStates();
            }
        });
    }

    // Setup map dots to jump directly to section
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentStationIndex = index;
            updateButtonStates();
        });
    });

    // --- Draggable Navigation Logic (for the mini-map) ---
    const navOverlay = document.getElementById('nav-overlay');
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    let xOffset = 0, yOffset = 0;

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
            navOverlay.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }


    function renderLoop() {
        // Smooth lerping factor (butter smooth animation towards the target index)
        currentProgress += (currentStationIndex - currentProgress) * 0.05;

        // Calculate Camera Panning
        const totalSegments = points.length - 1;
        const currentSegment = Math.min(Math.floor(currentProgress), totalSegments - 1);
        const segmentProgress = currentProgress - currentSegment;

        // Easing function (smoothstep) for softer transitions between stations
        const ease = t => t * t * (3 - 2 * t);
        const easedProgress = ease(segmentProgress);

        const startPoint = points[currentSegment];
        const endPoint = points[currentSegment + 1];

        const currentCamX = startPoint.x + (endPoint.x - startPoint.x) * easedProgress;
        const currentCamY = startPoint.y + (endPoint.y - startPoint.y) * easedProgress;

        const world = document.getElementById('canvas-world');
        if (world) {
            world.style.transform = `translate3d(${currentCamX}vw, ${currentCamY}vh, 0)`;
        }

        // Apply Blurs, Opacity and Active states
        dots.forEach((dot, index) => {
            const distance = Math.abs(currentProgress - index);

            // Map Dot logic
            if (distance < 0.5) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }

            // Station Content logic
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

    // Init
    updateButtonStates();
    requestAnimationFrame(renderLoop);
}


// Setup Preloader logic
const loader = document.getElementById('shiva-loader');
if (loader) {
    // Minimum 2-second delay
    const minTimePromise = new Promise(resolve => setTimeout(resolve, 2000));

    // Page load promise
    const loadPromise = new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve);
        }
    });

    // Wait for both to finish before fading out
    Promise.all([minTimePromise, loadPromise]).then(() => {
        loader.classList.add('loaded');
        // Remove it entirely from DOM after transition completes (1000ms)
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 1000);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initJournal);
} else {
    initJournal();
}
