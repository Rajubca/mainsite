function initJournal() {
    const dots = document.querySelectorAll('.map-dot');
    const stations = document.querySelectorAll('.station');
    const points = [];

    // Parse coordinates and position the dots physically on the map
    stations.forEach((station, index) => {
        const x = parseInt(station.getAttribute('data-x'));
        const y = parseInt(station.getAttribute('data-y'));
        points.push({ x: x, y: y });

        // Ensure station physical position matches coordinates on the canvas
        // x and y are the camera offset, meaning the station needs to be placed positively on the canvas
        station.style.left = `${Math.abs(x)}vw`;
        station.style.top = `${Math.abs(y)}vh`;
    });

    // State
    let currentStationIndex = 0; // The integer index (0-8) we are heading towards

    dots.forEach((dot, index) => {
        const pt = points[index];
        // points x is 0 to -400vw, map to 10% to 90%
        // points y is 0 to -300vh, map to 10% to 90%
        // 0vw -> 10%, -400vw -> 90%
        const leftPercent = 10 + (Math.abs(pt.x) / 400) * 80;

        // Y mapping: 0vh -> top: 10%, -300vh -> top: 90% (which means bottom: 10%)
        // Because the original dots used bottom/top CSS properties
        const topPercent = 10 + (Math.abs(pt.y) / 300) * 80;

        dot.style.left = `${leftPercent}%`;
        dot.style.top = `${topPercent}%`;
        dot.style.bottom = 'auto'; // override any hardcoded css
    });

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
    let hasLoaded = false;

    function hideLoader() {
        if (hasLoaded) return;
        hasLoaded = true;
        loader.classList.add('loaded');
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 1000);
    }

    // Minimum 2-second delay before we even CONSIDER hiding
    setTimeout(() => {
        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            // Once 2 seconds pass, if it finishes loading, hide it
            window.addEventListener('load', hideLoader);
        }
    }, 2000);

    // Absolute Failsafe: No matter what, hide the loader after 5 seconds
    // so the user is never stuck looking at the logo forever if an image hangs
    setTimeout(hideLoader, 5000);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initJournal);
} else {
    initJournal();
}
