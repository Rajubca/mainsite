from django.shortcuts import render
from .models import Station

from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.mail import get_connection, EmailMessage
from .models import ContactMessage, SiteSettings
import json

@ensure_csrf_cookie
def index(request):
    stations = Station.objects.all().order_by('order')
    return render(request, 'core/journal1.html', {'stations': stations})

def contact_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            message = data.get('message')

            if not all([name, email, message]):
                return JsonResponse({'error': 'All fields are required.'}, status=400)

            # Save to database
            ContactMessage.objects.create(name=name, email=email, message=message)

            # Attempt to send email
            settings = SiteSettings.load()
            if settings.smtp_host and settings.contact_recipient_email:
                connection = get_connection(
                    host=settings.smtp_host,
                    port=settings.smtp_port,
                    username=settings.smtp_user,
                    password=settings.smtp_password,
                    use_tls=settings.smtp_use_tls
                )
                email_msg = EmailMessage(
                    subject=f"New Website Inquiry from {name}",
                    body=f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}",
                    from_email=settings.smtp_user or email,
                    to=[settings.contact_recipient_email],
                    reply_to=[email],
                    connection=connection,
                )
                # Send email (fail silently to not break the user experience if SMTP is misconfigured)
                email_msg.send(fail_silently=True)

            return JsonResponse({'success': 'Transmission successful. We will contact you soon.'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)
