from django.test import TestCase
from django.urls import reverse

class SEOTests(TestCase):
    def test_robots_txt(self):
        response = self.client.get(reverse('robots_txt'))
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"User-Agent: *", response.content)

    def test_sitemap_xml(self):
        response = self.client.get(reverse('django.contrib.sitemaps.views.sitemap'))
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"urlset", response.content)
