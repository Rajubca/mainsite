from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = RichTextUploadingField()
    author = models.CharField(max_length=100)
    created_date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)

    class Meta:
        ordering = ['-created_date']

    def __str__(self):
        return self.title
