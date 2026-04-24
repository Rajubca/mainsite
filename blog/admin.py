from django.contrib import admin
from .models import Post, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'author', 'created_date', 'read_time')
    list_filter = ('status', 'category', 'created_date', 'author', 'tags')
    search_fields = ('title', 'content', 'author')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'category', 'tags', 'content', 'image', 'author')
        }),
        ('Status & SEO', {
            'fields': ('status', 'meta_title', 'meta_description', 'read_time')
        }),
    )
    readonly_fields = ('read_time',)
