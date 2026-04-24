from django.db import models
from taggit.managers import TaggableManager
from django.utils.html import strip_tags
import math
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Post(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    tags = TaggableManager(blank=True)
    content = RichTextUploadingField()
    author = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='published')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)

    # SEO & UX fields
    meta_title = models.CharField(max_length=200, blank=True, help_text="Optional SEO Title. Defaults to Post Title.")
    meta_description = models.TextField(blank=True, help_text="Optional SEO Description. Defaults to excerpt.")
    read_time = models.PositiveIntegerField(default=0, help_text="Estimated read time in minutes (auto-calculated).")

    class Meta:
        ordering = ['-created_date']

    def save(self, *args, **kwargs):
        # Auto-generate slug
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Post.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        # Calculate read time
        if self.content:
            text = strip_tags(self.content)
            word_count = len(text.split())
            self.read_time = math.ceil(word_count / 200) # Assuming 200 WPM

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
