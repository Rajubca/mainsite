with open('mainwebsite-5ad455c4b2414811777258e7460bb30e81c7616d/js/journal1.js', 'r') as f:
    js_content = f.read()

# Make sure we initialize all sections to opacity 0 BEFORE Swiper init to prevent FOUC
init_states_code = """
    // Initialize all sections to hidden state except the first one
    stations.forEach((station, i) => {
        const content = station.querySelector('.station-content');
        if (content) {
            content.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            if (i !== 0) {
                content.style.opacity = '0';
                content.style.transform = 'scale(0.95)';
                content.style.pointerEvents = 'none';
            }
        }
    });

    // Initialize Swiper
"""
if "Initialize all sections" not in js_content:
    js_content = js_content.replace('    // Initialize Swiper', init_states_code)

with open('mainwebsite-5ad455c4b2414811777258e7460bb30e81c7616d/js/journal1.js', 'w') as f:
    f.write(js_content)

print("Updated JS init opacity")
