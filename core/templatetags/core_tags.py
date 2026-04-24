from django import template
from django.template import Template, Context
from core.models import SiteSettings

register = template.Library()

@register.filter
def render_template_string(value, request=None):
    """
    Takes a string (like DB content) that contains Django template variables
    (e.g., {{ site_settings.phone }}) and renders it.
    """
    if not value:
        return ""
    try:
        t = Template(value)
        ctx = {'site_settings': SiteSettings.load()}
        if request:
            ctx['request'] = request
        return t.render(Context(ctx))
    except Exception as e:
        return value
