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
        // Smooth lerping factor (0.05 is very smooth and a bit slow)
        currentScroll += (targetScroll - currentScroll) * 0.035;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        let absoluteProgress = 0;

        if (maxScroll > 0) {
            // Map currentScroll (0 to maxScroll) to progress (0 to 8)
            absoluteProgress = (currentScroll / maxScroll) * (stations.length - 1);
        }

        dots.forEach((dot, index) => {
            const distance = Math.abs(absoluteProgress - index);

            // Map Dot logic
            if (distance < 0.5) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }

            // Station Content logic (Opacity, Blur & Scale & 3D transforms)
            const stationContent = stations[index].querySelector('.station-content');
            if (stationContent) {
                if (distance < 1.0) {
                    stations[index].classList.add('active');
                    stations[index].classList.add('is-visible');

                    // Opacity fades out based on distance
                    const opacity = Math.max(0, 1 - (distance * 1.5));
                    stationContent.style.opacity = opacity.toString();

                    if (distance < 0.2) {
                        stationContent.style.pointerEvents = 'auto';
                    } else {
                        stationContent.style.pointerEvents = 'none';
                    }

                    // Apply blur to ALL sections as they move out of view
                    // The further away (distance), the blurrier it gets
                    const blurAmount = distance * 20; // Max 20px blur
                    stationContent.style.filter = `blur(${blurAmount}px)`;

                    let transformStr = '';

                    switch(index) {
                        case 0:
                            const scale0 = Math.max(0.85, 1 - (distance * 0.15));
                            transformStr = `translate3d(0,0,0) scale(${scale0})`;
                            break;
                        case 1:
                            const transX1 = distance * -150;
                            const scale1 = Math.max(0.9, 1 - (distance * 0.1));
                            transformStr = `translate3d(${transX1}px, 0, 0) scale(${scale1})`;
                            break;
                        case 2:
                            const transX2 = distance * 150;
                            const scale2 = Math.max(0.9, 1 - (distance * 0.1));
                            transformStr = `translate3d(${transX2}px, 0, 0) scale(${scale2})`;
                            break;
                        case 3:
                            const rotX3 = distance * 15;
                            const scale3 = Math.max(0.9, 1 - (distance * 0.1));
                            transformStr = `perspective(1000px) rotateX(${rotX3}deg) scale(${scale3})`;
                            break;
                        case 4:
                            const scale4 = Math.max(0.7, 1 - (distance * 0.3));
                            transformStr = `translate3d(0,0,0) scale(${scale4})`;
                            break;
                        case 5:
                            const transY5 = distance * 200;
                            const scale5 = Math.max(0.9, 1 - (distance * 0.1));
                            transformStr = `translate3d(0, ${transY5}px, 0) scale(${scale5})`;
                            break;
                        case 6:
                            const scale6 = Math.max(0.95, 1 - (distance * 0.05));
                            transformStr = `translate3d(0,0,0) scale(${scale6})`;
                            break;
                        case 7:
                            const transY7 = distance * -200;
                            const scale7 = Math.max(0.9, 1 - (distance * 0.1));
                            transformStr = `translate3d(0, ${transY7}px, 0) scale(${scale7})`;
                            break;
                        case 8:
                            const scale8 = Math.max(0.8, 1 - (distance * 0.2));
                            transformStr = `translate3d(0,0,0) scale(${scale8})`;
                            break;
                    }
                    stationContent.style.transform = transformStr;

                } else {
                    stations[index].classList.remove('active');
                    stations[index].classList.remove('is-visible');
                    stationContent.style.opacity = '0';
                    stationContent.style.pointerEvents = 'none';
                    stationContent.style.transform = 'translate3d(0,0,0) scale(0.5)';
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
