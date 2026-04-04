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


    // Smooth scrolling variables for transition effects
    let currentScroll = worldContainer.scrollTop;
    let targetScroll = worldContainer.scrollTop;

    function renderLoop() {
        targetScroll = worldContainer.scrollTop;
        currentScroll += (targetScroll - currentScroll) * 0.1; // Smooth lerping factor

        const windowHeight = window.innerHeight;
        // Float index representing current scroll position
        const absoluteProgress = currentScroll / windowHeight;

        dots.forEach((dot, index) => {
            const distance = Math.abs(absoluteProgress - index);

            // Map Dot logic
            if (distance < 0.5) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }

            // Station Content logic (Opacity & Scale & 3D transforms)
            const stationContent = stations[index].querySelector('.station-content');
            if (stationContent) {
                if (distance < 0.8) {
                    stations[index].classList.add('active');
                    stations[index].classList.add('is-visible'); // Trigger station glow

                    stationContent.style.opacity = '1';
                    stationContent.style.pointerEvents = 'auto';

                    let transformStr = '';

                    switch(index) {
                        case 0:
                            const scale0 = Math.max(0.85, 1 - (distance * 0.15));
                            transformStr = `scale(${scale0})`;
                            break;
                        case 1:
                            const transX1 = distance * -150;
                            const scale1 = Math.max(0.9, 1 - (distance * 0.1));
                            transformStr = `translateX(${transX1}px) scale(${scale1})`;
                            break;
                        case 2:
                            const transX2 = distance * 150;
                            const scale2 = Math.max(0.9, 1 - (distance * 0.1));
                            transformStr = `translateX(${transX2}px) scale(${scale2})`;
                            break;
                        case 3:
                            const rotX3 = distance * 15;
                            const scale3 = Math.max(0.9, 1 - (distance * 0.1));
                            transformStr = `perspective(1000px) rotateX(${rotX3}deg) scale(${scale3})`;
                            break;
                        case 4:
                            const scale4 = Math.max(0.7, 1 - (distance * 0.3));
                            transformStr = `scale(${scale4})`;
                            break;
                        case 5:
                            const transY5 = distance * 200;
                            const scale5 = Math.max(0.9, 1 - (distance * 0.1));
                            transformStr = `translateY(${transY5}px) scale(${scale5})`;
                            break;
                        case 6:
                            const scale6 = Math.max(0.95, 1 - (distance * 0.05));
                            transformStr = `scale(${scale6})`;
                            stationContent.style.filter = `blur(${distance * 10}px)`;
                            break;
                        case 7:
                            const transY7 = distance * -200;
                            const scale7 = Math.max(0.9, 1 - (distance * 0.1));
                            transformStr = `translateY(${transY7}px) scale(${scale7})`;
                            break;
                        case 8:
                            const scale8 = Math.max(0.8, 1 - (distance * 0.2));
                            transformStr = `scale(${scale8})`;
                            break;
                    }
                    stationContent.style.transform = transformStr;
                    if(index !== 6) stationContent.style.filter = 'none';

                } else {
                    stations[index].classList.remove('active');
                    stations[index].classList.remove('is-visible');
                    stationContent.style.opacity = '0';
                    stationContent.style.pointerEvents = 'none';
                    stationContent.style.transform = 'scale(0.5)';
                    if(index === 6) stationContent.style.filter = 'blur(10px)';
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
