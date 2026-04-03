from django.shortcuts import render
from blog.models import Post

def index(request):
    latest_posts = Post.objects.all()[:3]
    return render(request, 'core/journal1.html', {'latest_posts': latest_posts})
