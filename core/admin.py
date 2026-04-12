from django.contrib import admin
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator
from .models import Station, SiteSettings

from django.forms.widgets import Input
from django import forms

class ColorWidget(Input):
    input_type = 'color'
    template_name = 'django/forms/widgets/input.html'

class StationForm(forms.ModelForm):
    class Meta:
        model = Station
        fields = '__all__'
        widgets = {
            'bg_color': ColorWidget(),
            'border_color': ColorWidget(),
            'text_color': ColorWidget(),
        }

@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    form = StationForm


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
            'fields': ('bg_color', 'border_color', 'text_color', 'blur_backdrop', 'animation_style', 'custom_css')
        }),
    )

    @method_decorator(never_cache)
    def changelist_view(self, request, extra_context=None):
        return super().changelist_view(request, extra_context)

    @method_decorator(never_cache)
    def change_view(self, request, object_id, form_url='', extra_context=None):
        return super().change_view(request, object_id, form_url, extra_context)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    # To prevent creating multiple settings
    def has_add_permission(self, request):
        return False if self.model.objects.count() > 0 else super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False
