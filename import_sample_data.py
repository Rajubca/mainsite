import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

from core.models import Station
from blog.models import Post, Category

def import_data():
    """
    Sample script demonstrating how to programmatically import data
    from a JSON file into Django using the ORM.
    """
    if not os.path.exists('stations_backup.json'):
        print("Backup file 'stations_backup.json' not found. Creating a minimal example...")
        return

    print("Loading Stations...")
    with open('stations_backup.json', 'r') as f:
        data = json.load(f)

    stations_created = 0
    for item in data:
        if item['model'] == 'core.station':
            fields = item['fields']
            station_id = item.get('pk')

            # Using update_or_create ensures we update existing ones or create new ones
            obj, created = Station.objects.update_or_create(
                id=station_id,
                defaults=fields
            )
            if created:
                stations_created += 1

    print(f"Successfully processed {len(data)} items. Created {stations_created} new stations.")

    print("\nHow to use the Admin interface for imports instead:")
    print("1. Go to the Django Admin -> Core -> Stations")
    print("2. Click the 'Import' button in the top right corner.")
    print("3. Upload your CSV, JSON, or Excel file.")
    print("4. Follow the prompts to confirm your data.")

if __name__ == '__main__':
    import_data()
