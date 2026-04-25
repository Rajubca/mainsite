from django.db import models

class GlobalSEOSettings(models.Model):
    """
    Global SEO settings that act as a fallback for the entire site.
    """
    meta_title = models.CharField(max_length=255, default='Shiva Services')
    meta_description = models.TextField(blank=True, help_text="Default meta description for the site.")
    meta_keywords = models.CharField(max_length=500, blank=True, help_text="Comma-separated keywords.")

    # Open Graph (Social Sharing)
    og_title = models.CharField(max_length=255, blank=True, help_text="Default Open Graph title")
    og_description = models.TextField(blank=True, help_text="Default Open Graph description")
    og_image = models.ImageField(upload_to='seo_images/', blank=True, null=True, help_text="Default image when sharing the site on social media.")

    # Twitter Cards
    twitter_card_type = models.CharField(max_length=50, choices=[('summary', 'Summary'), ('summary_large_image', 'Summary Large Image')], default='summary_large_image')
    twitter_site = models.CharField(max_length=100, blank=True, help_text="e.g., @shivaservices")

    # Tracking & Verification
    google_analytics_id = models.CharField(max_length=50, blank=True, help_text="e.g., G-XXXXXXX or UA-XXXXX-Y")
    google_search_console_verification = models.CharField(max_length=255, blank=True, help_text="Google site verification code")

    class Meta:
        verbose_name = 'Global SEO Settings'
        verbose_name_plural = 'Global SEO Settings'

    def save(self, *args, **kwargs):
        # Ensure only one instance exists (singleton)
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass # Prevent deletion

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Global SEO Settings"

class SEOModel(models.Model):
    """
    Abstract base model that other models can inherit from to add SEO fields.
    """
    seo_title = models.CharField(max_length=255, blank=True, help_text="Overrides the default meta title")
    seo_description = models.TextField(blank=True, help_text="Overrides the default meta description")
    seo_keywords = models.CharField(max_length=500, blank=True, help_text="Overrides the default meta keywords")
    seo_og_image = models.ImageField(upload_to='seo_images/per_page/', blank=True, null=True, help_text="Overrides the default OG image")

    class Meta:
        abstract = True
