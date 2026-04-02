import re

with open('mainwebsite-5ad455c4b2414811777258e7460bb30e81c7616d/journal1.html', 'r') as f:
    content = f.read()

# Add Swiper CSS to <head> if not exists
if 'swiper-bundle.min.css' not in content:
    content = content.replace('</head>', '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />\n</head>')

# Add Swiper JS before closing </body> if not exists
if 'swiper-bundle.min.js' not in content:
    content = content.replace('</body>', '<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>\n</body>')

# Replace #main-scroller classes with Swiper classes
content = re.sub(
    r'<div id="main-scroller"[^>]*>',
    '<div id="main-scroller" class="swiper mySwiper h-screen w-full relative">',
    content
)

# Add Swiper wrapper class to #canvas-world
content = re.sub(
    r'<div id="canvas-world"[^>]*>',
    '<div id="canvas-world" class="swiper-wrapper w-full">',
    content
)

# Remove snap-start class and add swiper-slide to sections
content = re.sub(
    r'<section class="([^"]*)station([^"]*)snap-start([^"]*)"',
    r'<section class="\1station\2swiper-slide\3"',
    content
)

with open('mainwebsite-5ad455c4b2414811777258e7460bb30e81c7616d/journal1.html', 'w') as f:
    f.write(content)

print("Updated HTML for Swiper")
