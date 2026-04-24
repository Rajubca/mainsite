from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_post_meta_description_post_meta_title_post_read_time_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='slug',
            field=models.SlugField(blank=True, max_length=250, unique=True, default='temp-slug'),
            preserve_default=False,
        ),
    ]
