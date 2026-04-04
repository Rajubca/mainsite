import re

with open('static/css/journal1.css', 'r') as f:
    content = f.read()

# Remove the fixed dimensions and background for #canvas-world as it's now handled by tailwind classes
content = re.sub(r'#canvas-world \{[\s\S]*?will-change: transform;\n        \}', r'''#canvas-world {
            /* Tailwind classes manage width, height, and scrolling */
            /* Advanced animated mesh gradient background */
            background-color: #0b1120;
            background-image:
                radial-gradient(circle at 10vw 20vh, rgba(59, 130, 246, 0.15), transparent 40vw),
                radial-gradient(circle at 120vw 80vh, rgba(234, 179, 8, 0.1), transparent 40vw),
                radial-gradient(circle at 250vw 20vh, rgba(59, 130, 246, 0.15), transparent 50vw),
                radial-gradient(circle at 350vw 80vh, rgba(234, 179, 8, 0.15), transparent 40vw),
                radial-gradient(circle at 450vw 10vh, rgba(59, 130, 246, 0.1), transparent 50vw),
                linear-gradient(to bottom, transparent, rgba(15, 23, 42, 0.8));
        }''', content)


content = re.sub(r'/\* Ambient floating orbs in the background \*/[\s\S]*?z-index: -1;\n        \}', r'''/* Ambient floating orbs in the background */
        #canvas-world::before {
            content: '';
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
            pointer-events: none;
            z-index: -1;
        }''', content)

# Remove the `.station` position logic
content = re.sub(r'/\* Each section of the M \*/[\s\S]*?#station-9 \{ top: 300vh; left: 400vw; \}[\s\S]*?/\* The proxy element', '/* The proxy element', content)

# Remove #scroll-proxy css entirely
content = re.sub(r'/\* The proxy element[\s\S]*?z-index: -1;\n        \}', '', content)

# Update .station-content to be responsive and visible
content = re.sub(r'\.station-content \{[\s\S]*?transform: scale\(0\.95\);\n        \}', r'''.station-content {
            background: rgba(15, 23, 42, 0.6) !important;
            backdrop-filter: blur(24px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1) !important;
            padding: 3rem;
            border-radius: 24px;
            max-width: 1200px;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            opacity: 1; /* Always visible in the new scroll system */
            transform: none; /* No scaling down */
        }''', content)

with open('static/css/journal1.css', 'w') as f:
    f.write(content)
