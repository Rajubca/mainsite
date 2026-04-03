# Django Project with Blog App

This is a Django application converted from a static site. It includes the main frontend interface along with a fully functional Blog application.

## Features
- **Main Site:** Preserves the original HTML, CSS, and JS of the static site.
- **Blog App:** Includes a model for posts with a rich-text editor (CKEditor), displaying the latest posts first.
- **Admin Interface:** Easy management of blog posts.
- **Tailwind CSS:** Built using Tailwind CSS.

## Requirements
- Python 3.x
- Virtual Environment (recommended)

## Setup Instructions

1. **Clone the repository and navigate to the directory:**
   ```bash
   # Make sure you are in the project root
   cd path/to/project
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Database Migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a Superuser for Admin access:**
   ```bash
   python manage.py createsuperuser
   # Follow the prompts to set username, email, and password
   ```

6. **Run the Development Server:**
   ```bash
   python manage.py runserver
   ```

7. **Access the Site:**
   - **Main site:** http://127.0.0.1:8000/
   - **Blog list:** http://127.0.0.1:8000/blog/
   - **Admin interface:** http://127.0.0.1:8000/admin/
   - **Create a New Blog Post:** http://127.0.0.1:8000/admin/blog/post/add/
