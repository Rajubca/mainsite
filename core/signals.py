from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from django.contrib.sessions.models import Session
from .models import SiteSettings, UserActiveSession

@receiver(user_logged_in)
def on_user_logged_in(sender, request, user, **kwargs):
    # Important: The session might not exist physically in the DB yet if it's brand new.
    # Force a save to generate a session key if one doesn't exist.
    if not request.session.session_key:
        request.session.create()

    session_key = request.session.session_key

    # Track this session
    UserActiveSession.objects.update_or_create(
        session_key=session_key,
        defaults={'user': user}
    )

    # Check limits
    settings = SiteSettings.load()
    limit = settings.max_concurrent_logins

    # If limit is 0, unlimited allowed.
    if limit > 0:
        # Get all sessions for this user, ordered by oldest first
        user_sessions = UserActiveSession.objects.filter(user=user).order_by('created_at')

        # If we have more sessions than the limit, delete the oldest ones
        if user_sessions.count() > limit:
            # We want to keep the most recent `limit` sessions
            sessions_to_delete = user_sessions.count() - limit
            oldest_sessions = user_sessions[:sessions_to_delete]

            for tracked_session in oldest_sessions:
                # Delete actual Django session (this logs them out)
                Session.objects.filter(session_key=tracked_session.session_key).delete()
                # Delete our tracker
                tracked_session.delete()

@receiver(user_logged_out)
def on_user_logged_out(sender, request, user, **kwargs):
    session_key = request.session.session_key
    if session_key:
        UserActiveSession.objects.filter(session_key=session_key).delete()
