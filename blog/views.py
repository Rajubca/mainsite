from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from .models import Post, Category
from taggit.models import Tag

def post_list(request, tag_slug=None):
    category_slug = request.GET.get('category')
    search_query = request.GET.get('q')
    categories = Category.objects.all()

    # Base queryset: only published posts
    posts_list = Post.objects.filter(status='published')

    active_category = None
    active_tag = None

    if category_slug:
        active_category = get_object_or_404(Category, slug=category_slug)
        posts_list = posts_list.filter(category=active_category)

    if tag_slug:
        active_tag = get_object_or_404(Tag, slug=tag_slug)
        posts_list = posts_list.filter(tags__in=[active_tag])

    if search_query:
        posts_list = posts_list.filter(
            Q(title__icontains=search_query) |
            Q(content__icontains=search_query) |
            Q(author__icontains=search_query)
        ).distinct()

    paginator = Paginator(posts_list, 6) # 6 posts per page for infinite scroll to show properly
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
        'active_category': active_category,
        'active_tag': active_tag,
        'search_query': search_query,
        'has_next': posts.has_next(),
        'next_page_number': posts.next_page_number() if posts.has_next() else None,
    }

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'blog/post_list_partial.html', context)

    return render(request, 'blog/post_list.html', context)

def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, status='published')

    # Get related posts based on similar tags
    post_tags_ids = post.tags.values_list('id', flat=True)
    similar_posts = Post.objects.filter(status='published', tags__in=post_tags_ids).exclude(id=post.id)
    # Fallback to category if no tags
    if not similar_posts.exists() and post.category:
        similar_posts = Post.objects.filter(status='published', category=post.category).exclude(id=post.id)

    similar_posts = similar_posts.distinct()[:3]

    return render(request, 'blog/post_detail.html', {'post': post, 'similar_posts': similar_posts})
