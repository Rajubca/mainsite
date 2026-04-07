from django.contrib import admin
from .models import Station, SiteSettings

@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = ('order', 'title', 'x_position', 'y_position', 'animation_style')
    list_display_links = ('title',)
    list_editable = ('order', 'x_position', 'y_position', 'animation_style')
    search_fields = ('title', 'content')
    fieldsets = (
        ('Content', {
            'fields': ('order', 'eyebrow', 'title', 'content')
        }),
        ('Map Positioning', {
            'fields': ('x_position', 'y_position'),
            'description': 'Set coordinates as negative VW/VH values. e.g. x: 0, y: -150 moves the camera down 1.5 screens.'
        }),
        ('Dimensions & Layout', {
            'fields': ('width', 'max_width', 'height', 'max_height', 'padding', 'overflow_behavior'),
            'description': 'Use standard CSS values like 100%, 800px, auto, or 90vh.'
        }),
        ('Appearance & Animation', {
            'fields': ('bg_color', 'border_color', 'text_color', 'blur_backdrop', 'animation_style')
        }),
    )


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    # To prevent creating multiple settings
    def has_add_permission(self, request):
        return False if self.model.objects.count() > 0 else super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False
