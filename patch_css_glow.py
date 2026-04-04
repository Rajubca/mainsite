import re

with open('static/css/journal1.css', 'r') as f:
    content = f.read()

# Update .station-glow to be visible when .active class is applied by IntersectionObserver
content = re.sub(r'\.station\.active \.station-glow \{[\s\S]*?\}', r'''.station.is-visible .station-glow {
    opacity: 1;
}''', content)


with open('static/css/journal1.css', 'w') as f:
    f.write(content)
