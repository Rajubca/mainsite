import os

settings_path = 'shiva_project/shiva_project/settings.py'

with open(settings_path, 'r') as f:
    content = f.read()

# Add static/templates configurations
static_config = """
STATIC_URL = 'static/'
import os
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]
"""

content = content.replace("STATIC_URL = 'static/'", static_config)

# Update TEMPLATES setting DIRS to point to project level templates if needed
content = content.replace(
    "'DIRS': [],",
    "'DIRS': [os.path.join(BASE_DIR, 'templates')],\n        'APP_DIRS': True,"
)

# Clean up duplicate APP_DIRS if it was already there
if content.count("'APP_DIRS': True,") > 1:
    content = content.replace("'APP_DIRS': True,\n        'APP_DIRS': True,", "'APP_DIRS': True,")


with open(settings_path, 'w') as f:
    f.write(content)

print("Updated settings.py for STATIC and TEMPLATES")
