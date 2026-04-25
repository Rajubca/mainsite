from django.contrib import admin
from .models import GlobalSEOSettings

@admin.register(GlobalSEOSettings)
class GlobalSEOSettingsAdmin(admin.ModelAdmin):
    # Only allow one instance to be created
    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False
