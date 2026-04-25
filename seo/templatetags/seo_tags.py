from django import template
from seo.models import GlobalSEOSettings

register = template.Library()

@register.inclusion_tag('seo/meta_tags.html', takes_context=True)
def render_seo_tags(context, obj=None):
    """
    Renders SEO meta tags. If an object (like a Post or Station) is provided,
    it checks for specific SEO overrides. Otherwise, it uses the global settings.
    """
    request = context.get('request')
    settings = GlobalSEOSettings.load()

    # Default values from global settings
    meta = {
        'title': settings.meta_title,
        'description': settings.meta_description,
        'keywords': settings.meta_keywords,
        'og_title': settings.og_title or settings.meta_title,
        'og_description': settings.og_description or settings.meta_description,
        'og_image': settings.og_image.url if settings.og_image else None,
        'twitter_card': settings.twitter_card_type,
        'twitter_site': settings.twitter_site,
        'ga_id': settings.google_analytics_id,
        'gsc_verification': settings.google_search_console_verification,
        'url': request.build_absolute_uri() if request else '',
    }

    # Overrides if an object inherits from SEOModel and provides custom values
    if obj:
        if hasattr(obj, 'seo_title') and obj.seo_title:
            meta['title'] = obj.seo_title
            meta['og_title'] = obj.seo_title
        elif hasattr(obj, 'title') and obj.title:
            # Fallback to model's default title field if it exists
            meta['title'] = f"{obj.title} | {settings.meta_title}"
            meta['og_title'] = obj.title

        if hasattr(obj, 'seo_description') and obj.seo_description:
            meta['description'] = obj.seo_description
            meta['og_description'] = obj.seo_description

        if hasattr(obj, 'seo_keywords') and obj.seo_keywords:
            meta['keywords'] = obj.seo_keywords

        if hasattr(obj, 'seo_og_image') and obj.seo_og_image:
            meta['og_image'] = obj.seo_og_image.url
        elif hasattr(obj, 'image') and obj.image: # Fallback to post image for example
            meta['og_image'] = obj.image.url

    return {'meta': meta}
