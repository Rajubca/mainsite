import os
import django

# Set up the Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

from blog.models import Category, Post

def create_sample_blogs():
    print("Initializing sample blog post generation...")

    # Ensure a category exists
    category, created = Category.objects.get_or_create(
        name="Digital Architecture",
        defaults={'slug': 'digital-architecture'}
    )
    if created:
        print(f"Created category: {category.name}")
    else:
        print(f"Using existing category: {category.name}")

    # --- Sample 1: Multiple Images ---
    post1_title = "The Evolution of Digital Interfaces"
    post1_content = """
    <h2>Visualizing the Future</h2>
    <p>User interfaces have evolved from simple text terminals to complex, interactive 3D environments. Below is a representation of modern UI concepts.</p>
    <figure class="image">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" alt="Data Analytics on Screen">
        <figcaption>Complex data analytics interfaces.</figcaption>
    </figure>
    <p>The transition requires a deep understanding of human-computer interaction, blending psychology with aesthetic precision.</p>
    <figure class="image">
        <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80" alt="Design System">
        <figcaption>A robust design system.</figcaption>
    </figure>
    <p>The journey has just begun.</p>
    """

    # --- Sample 2: Multiple Videos ---
    post2_title = "Masterclass: Enterprise Systems"
    post2_content = """
    <h2>Scaling the Unscalable</h2>
    <p>Building systems that scale requires robust architecture. Here is an incredible breakdown of system design fundamentals.</p>
    <div class="ck-media__wrapper">
        <iframe src="https://www.youtube.com/embed/bEnZKMNOOac" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <p>Once you understand the architecture, applying it to real-world cloud environments is the next hurdle.</p>
    <div class="ck-media__wrapper">
        <iframe src="https://www.youtube.com/embed/1MacxZyDWo4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <p>Review these materials carefully before beginning your next infrastructure project.</p>
    """

    # --- Sample 3: Mixed Media (Images + Videos) ---
    post3_title = "The Synthesis of Art and Code"
    post3_content = """
    <h2>A Multi-Disciplinary Approach</h2>
    <p>When design and engineering teams collaborate closely, the results can be extraordinary. Consider the modern workspace.</p>
    <figure class="image">
        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80" alt="Creative Workspace">
        <figcaption>The modern developer's environment.</figcaption>
    </figure>
    <p>A great workspace often requires the right ambient atmosphere to maintain focus.</p>
    <div class="ck-media__wrapper">
        <iframe src="https://www.youtube.com/embed/5qap5aO4i9A" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <p>Let the synthesis of environment and technology drive your daily innovations.</p>
    """

    samples = [
        (post1_title, post1_content),
        (post2_title, post2_content),
        (post3_title, post3_content)
    ]

    posts_created = 0
    for title, content in samples:
        # Use update_or_create to avoid duplicate spam if script is run multiple times
        obj, created = Post.objects.update_or_create(
            title=title,
            defaults={
                'category': category,
                'author': 'System Administrator',
                'content': content
            }
        )
        if created:
            posts_created += 1
            print(f"Created post: '{title}'")
        else:
            print(f"Updated post: '{title}'")

    print(f"\nSuccessfully generated {posts_created} new sample blog posts!")

if __name__ == '__main__':
    create_sample_blogs()
