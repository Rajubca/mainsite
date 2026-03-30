function initJournal() {
        const world = document.getElementById('canvas-world');
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

        // Define the 9 coordinates (x, y) as percentages of viewport
        // We negate the values because moving the *camera* right means moving the *world* left
        // Our world is 400vw x 400vh
        const points = [
            { x: 0, y: -300 },      // Station 1: Start at bottom-left (top: 300vh, view is -300vh)
            { x: 0, y: -150 },      // Station 2: Mid-up left (top: 150vh, view is -150vh)
            { x: 0, y: 0 },         // Station 3: Top-left (top: 0vh)
            { x: -100, y: -150 },   // Station 4: Mid-diagonal down
            { x: -200, y: -300 },   // Station 5: Center-bottom
            { x: -300, y: -150 },   // Station 6: Mid-diagonal up
            { x: -400, y: 0 },      // Station 7: Top-right
            { x: -400, y: -150 },   // Station 8: Mid-down right
            { x: -400, y: -300 }    // Station 9: Bottom-right
        ];

        // Smooth scrolling variables
        let currentScroll = window.scrollY;
        let targetScroll = window.scrollY;

        function updateScroll() {
            // Use the smoothly interpolated scroll value
            const scrollTop = currentScroll;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

            if (maxScroll <= 0) return;

            // Progress from 0.0 to 1.0
            const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

            // We have 8 "segments" between our 9 points
            const totalSegments = points.length - 1;

            // Which segment are we currently in?
            const currentSegment = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);

            // How far along are we within this specific segment? (0.0 to 1.0)
            const segmentProgress = (progress * totalSegments) - currentSegment;

            // Interpolate X and Y
            const startPoint = points[currentSegment];
            const endPoint = points[currentSegment + 1];

            // Easing function (smoothstep) for softer transitions between stations
            const ease = t => t * t * (3 - 2 * t);
            const easedProgress = ease(segmentProgress);

            const currentX = startPoint.x + (endPoint.x - startPoint.x) * easedProgress;
            const currentY = startPoint.y + (endPoint.y - startPoint.y) * easedProgress;

            // Apply transform to move the entire world canvas
            world.style.transform = `translate3d(${currentX}vw, ${currentY}vh, 0)`;

            // Update right-side scroll slider
            if (scrollProgressBar) {
                scrollProgressBar.style.height = `${progress * 100}%`;
            }

            // Update FAB visibility
            updateScrollToTopVisibility(progress);

            // Update navigation map dots and station content opacity/scale
            const absoluteProgress = progress * totalSegments;

            dots.forEach((dot, index) => {
                const distance = Math.abs(absoluteProgress - index);

                // Map Dot logic
                if (distance < 0.5) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }

                // Station Content logic (Opacity & Scale)
                const stationContent = stations[index].querySelector('.station-content');
                if (stationContent) {
                    if (distance < 0.8) {
                        stations[index].classList.add('active');
                        // In view / active
                        // User requested to remove opacity transition for active section (keep it solid 1)
                        stationContent.style.opacity = '1';
                        stationContent.style.pointerEvents = 'auto';

                        // Custom smooth transforms per station ensuring spatial isolation
                        // By scaling down significantly when inactive, we prevent overlapping blocks visually.
                        let transformStr = '';
                        // distance goes from 0 (perfectly centered) to >1.0 (far away)

                        switch(index) {
                            case 0: // Gateway: Zoom in from slightly smaller
                                const scale0 = Math.max(0.85, 1 - (distance * 0.15));
                                transformStr = `scale(${scale0})`;
                                break;
                            case 1: // Vision: Slide from left
                                const transX1 = distance * -150;
                                const scale1 = Math.max(0.9, 1 - (distance * 0.1));
                                transformStr = `translateX(${transX1}px) scale(${scale1})`;
                                break;
                            case 2: // Construction: Slide from right
                                const transX2 = distance * 150;
                                const scale2 = Math.max(0.9, 1 - (distance * 0.1));
                                transformStr = `translateX(${transX2}px) scale(${scale2})`;
                                break;
                            case 3: // AI Market: Gentle 3D Tilt backward
                                const rotX3 = distance * 15;
                                const scale3 = Math.max(0.9, 1 - (distance * 0.1));
                                transformStr = `perspective(1000px) rotateX(${rotX3}deg) scale(${scale3})`;
                                break;
                            case 4: // Digital Eng: Intense scale up
                                const scale4 = Math.max(0.7, 1 - (distance * 0.3));
                                transformStr = `scale(${scale4})`;
                                break;
                            case 5: // Web Studio: Slide up from bottom
                                const transY5 = distance * 200;
                                const scale5 = Math.max(0.9, 1 - (distance * 0.1));
                                transformStr = `translateY(${transY5}px) scale(${scale5})`;
                                break;
                            case 6: // Wellness: Blur and subtle scale
                                const scale6 = Math.max(0.95, 1 - (distance * 0.05));
                                transformStr = `scale(${scale6})`;
                                stationContent.style.filter = `blur(${distance * 10}px)`;
                                break;
                            case 7: // Future: Slide down from top
                                const transY7 = distance * -200;
                                const scale7 = Math.max(0.9, 1 - (distance * 0.1));
                                transformStr = `translateY(${transY7}px) scale(${scale7})`;
                                break;
                            case 8: // Journey: Sink into background
                                const scale8 = Math.max(0.8, 1 - (distance * 0.2));
                                transformStr = `scale(${scale8})`;
                                break;
                        }
                        stationContent.style.transform = transformStr;
                        if(index !== 6) stationContent.style.filter = 'none';

                    } else {
                        stations[index].classList.remove('active');
                        // Far away: Move completely out of view or scale down tiny to prevent overlapping bounds
                        stationContent.style.opacity = '0'; // Fully invisible to prevent overlap
                        stationContent.style.pointerEvents = 'none';
                        stationContent.style.transform = 'scale(0.5)'; // Tiny footprint
                        if(index === 6) stationContent.style.filter = 'blur(10px)';
                    }
                }
            });
        }

        // Scroll-To-Top button logic (Custom slow scroll)
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        const scrollProgressBar = document.getElementById('scroll-progress-bar');
        scrollToTopBtn.addEventListener('click', () => {
            const startY = window.scrollY;
            const duration = 3000; // 1.5 seconds scroll duration
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;

                // easeInOutQuad easing function
                let t = timeElapsed / duration;
                t = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                const distance = -startY * t;
                window.scrollTo(0, startY + distance);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    window.scrollTo(0, 0); // Ensure it reaches exact top
                }
            }
            requestAnimationFrame(animation);
        });

        function updateScrollToTopVisibility(progress) {
            if (progress > 0.1) {
                // Show button when scrolled past 10%
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.pointerEvents = 'auto';
                scrollToTopBtn.style.transform = 'translateY(0)';
            } else {
                // Hide button at the top
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.pointerEvents = 'none';
                scrollToTopBtn.style.transform = 'translateY(1rem)';
            }
        }

        // Initialize display
        updateScroll();

        // --- Draggable Navigation Logic ---
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

        // Attach mousemove/up to the window so dragging doesn't break if cursor leaves the box rapidly
        window.addEventListener('mousemove', drag);
        window.addEventListener('touchmove', drag, {passive: false});
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('touchend', dragEnd);

        function dragStart(e) {
            // Don't drag if clicking on a button, link, or dot
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
                // Prevent text selection while dragging
                if(e.type !== "touchstart") e.preventDefault();
            }
        }

        function drag(e) {
            if (isDragging) {
                if (e.type === "touchmove") {
                    e.preventDefault(); // Prevent scrolling while dragging
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

        // Update the target scroll position when the user native-scrolls
        window.addEventListener('scroll', () => {
            targetScroll = window.scrollY;
        });

        // The continuous rendering loop for buttery smooth interpolation (Lerp)
        function renderLoop() {
            // Linear Interpolation: move current 8% closer to target every frame
            // This creates a very smooth "gliding" effect between stations
            currentScroll += (targetScroll - currentScroll) * 0.1;

            // Only update the DOM if the values are noticeably different
            if (Math.abs(targetScroll - currentScroll) > 0.5) {
                updateScroll();
            }

            requestAnimationFrame(renderLoop);
        }

        // Start the continuous loop
        requestAnimationFrame(renderLoop);

        // Setup map dots to be clickable
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const targetScroll = (index / (points.length - 1)) * maxScroll;

                const startY = window.scrollY;
                const distance = targetScroll - startY;
                const duration = 3000; // 2 seconds
                let startTime = null;

                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;

                    // easeInOutQuart for a smoother, slightly more dramatic effect
                    let t = timeElapsed / duration;
                    let easedT = t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

                    window.scrollTo(0, startY + distance * easedT);

                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    } else {
                        window.scrollTo(0, targetScroll); // Ensure exact final position
                    }
                }

                requestAnimationFrame(animation);
            });

            // We removed mapLabel, hover is handled purely by CSS pseudo-elements
        });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initJournal);
} else {
    initJournal();
}