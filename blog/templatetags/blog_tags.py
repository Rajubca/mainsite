from django import template
from blog.models import Post

register = template.Library()

@register.simple_tag
def get_recent_posts(count=3):
    return Post.objects.filter(status='published').order_by('-created_date')[:count]
