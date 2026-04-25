from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Post, Category

def post_list(request):
    category_slug = request.GET.get('category')
    categories = Category.objects.all()

    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        post_list = Post.objects.filter(category=category)
        active_category = category
    else:
        post_list = Post.objects.all()
        active_category = None

    paginator = Paginator(post_list, 9) # Show 9 posts per page
    page = request.GET.get('page')

    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(1)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)

    context = {
        'posts': posts,
        'categories': categories,
        'active_category': active_category
    }

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'blog/post_list_partial.html', context)

    return render(request, 'blog/post_list.html', context)

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/post_detail.html', {'post': post})
