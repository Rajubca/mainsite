import os

settings_path = 'shiva_project/shiva_project/settings.py'

with open(settings_path, 'r') as f:
    content = f.read()

# Add the journal app to INSTALLED_APPS
content = content.replace(
    "'django.contrib.staticfiles',",
    "'django.contrib.staticfiles',\n    'journal',"
)

with open(settings_path, 'w') as f:
    f.write(content)

print("Updated settings.py with journal app")
