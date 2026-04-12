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

from ckeditor_uploader.fields import RichTextUploadingField

class Station(models.Model):
    ANIMATION_CHOICES = [
        ('dangle', 'Hanging on Rope (Swing)'),
        ('float', 'Floating Gently (Up/Down)'),
        ('pulse', 'Glowing/Pulsing Aura'),
        ('none', 'No Animation'),
    ]

    OVERFLOW_CHOICES = [
        ('auto', 'Auto (Scroll if needed)'),
        ('hidden', 'Hidden (Cut off)'),
        ('scroll', 'Always Show Scrollbar'),
        ('visible', 'Visible (Bleed out)'),
    ]

    # Content
    order = models.PositiveIntegerField(default=0, help_text="The sequence number on the journey (0, 1, 2, etc.)")
    title = models.CharField(max_length=200, help_text="e.g. 'The Gateway'")
    eyebrow = models.CharField(max_length=100, blank=True, help_text="e.g. 'Shiva Services - Est 2024'")
    content = RichTextUploadingField(help_text="The main HTML content of the station card")

    # Grid Position on the 2D Map Canvas
    x_position = models.IntegerField(default=0, help_text="X Coordinate in vw (e.g. 0, 100, 200). Negative moves the camera right.")
    y_position = models.IntegerField(default=0, help_text="Y Coordinate in vh (e.g. 0, -150, -300). Negative moves the camera down.")

    # Dimensions
    width = models.CharField(max_length=50, default='100%', help_text="CSS Width (e.g. '100%', '800px', 'max-content')")
    max_width = models.CharField(max_length=50, default='1200px', help_text="CSS Max Width (e.g. '1200px', '100%')")
    height = models.CharField(max_length=50, default='auto', help_text="CSS Height (e.g. 'auto', '80vh')")
    max_height = models.CharField(max_length=50, default='90vh', help_text="CSS Max Height (e.g. '90vh')")

    # Internal Layout
    padding = models.CharField(max_length=50, default='3rem', help_text="CSS Padding (e.g. '2rem', '3rem 4rem')")
    overflow_behavior = models.CharField(max_length=20, choices=OVERFLOW_CHOICES, default='auto')

    # Appearance Styling
    bg_color = models.CharField(max_length=50, default='#0f172a', help_text="Hex Color code for background (e.g. #0f172a)")
    border_color = models.CharField(max_length=50, default='#ffffff', help_text="Hex Color code for border (e.g. #ffffff)")
    text_color = models.CharField(max_length=50, default='#f8fafc', help_text="Hex Color code for text (e.g. #f8fafc)")

    # Custom Effects
    animation_style = models.CharField(max_length=20, choices=ANIMATION_CHOICES, default='dangle')
    blur_backdrop = models.CharField(max_length=50, default='24px', help_text="Backdrop blur amount (e.g. '24px', '0px' for none)")
    custom_css = models.TextField(blank=True, null=True, help_text="Add any custom raw CSS properties here (e.g. 'box-shadow: 0 0 50px red;'). Applied directly to the station card.")

    class Meta:
        ordering = ['order']
        verbose_name = 'Station Map Point'
        verbose_name_plural = 'Station Map Points'

    def __str__(self):
        return f"{self.order}: {self.title}"
