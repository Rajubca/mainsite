from django.shortcuts import render
from .models import Station

def index(request):
    stations = Station.objects.all().order_by('order')
    return render(request, 'core/journal1.html', {'stations': stations})
