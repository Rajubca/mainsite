from django.contrib.syndication.views import Feed
from django.urls import reverse
from django.template.defaultfilters import truncatewords
from .models import Post
from core.models import SiteSettings

class LatestPostsFeed(Feed):
    def title(self):
        settings = SiteSettings.load()
        return f"{settings.site_name} Latest Blogs"

    def link(self):
        return reverse('blog:post_list')

    def description(self):
        return "Updates on the latest stories and insights."

    def items(self):
        return Post.objects.filter(status='published').order_by('-created_date')[:10]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        if item.meta_description:
            return item.meta_description
        return truncatewords(item.content, 30)

    def item_link(self, item):
        return reverse('blog:post_detail', kwargs={'slug': item.slug})
