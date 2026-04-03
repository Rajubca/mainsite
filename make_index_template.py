import re

with open('mainwebsite-5ad455c4b2414811777258e7460bb30e81c7616d/journal1.html', 'r') as f:
    html = f.read()

# Extract body content between <body ...> and <script ...
start_idx = html.find('<body')
end_idx = html.rfind('<script src="https://cdn.jsdelivr.net')

if start_idx != -1 and end_idx != -1:
    body_content = html[start_idx:end_idx]

    # Remove the <body> tag itself
    body_start_tag_end = body_content.find('>') + 1
    body_content = body_content[body_start_tag_end:]

    # Construct the django template
    django_template = "{% extends 'base.html' %}\n{% load static %}\n\n{% block content %}\n" + body_content + "\n{% endblock %}\n"

    with open('shiva_project/templates/journal/index.html', 'w') as f:
        f.write(django_template)

    print("Created journal/index.html")
else:
    print("Could not extract body content")
