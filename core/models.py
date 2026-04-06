from django.db import models

class SiteSettings(models.Model):
    # Contact Info
    email = models.EmailField(default='contact@shivaservices.co.in')
    phone = models.CharField(max_length=20, default='+91 8000 951 195')
    address = models.TextField(default='123 Business Avenue, Tech Park, City')

    # Social Media Links
    facebook_url = models.URLField(blank=True, null=True, help_text="Facebook Profile/Page URL")
    twitter_url = models.URLField(blank=True, null=True, help_text="Twitter Profile URL")
    instagram_url = models.URLField(blank=True, null=True, help_text="Instagram Profile URL")
    linkedin_url = models.URLField(blank=True, null=True, help_text="LinkedIn Profile URL")

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def save(self, *args, **kwargs):
        # Force this to be a singleton
        self.pk = 1
        super(SiteSettings, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass # Prevent deletion

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Global Site Settings"
