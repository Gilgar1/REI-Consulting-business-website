from .base import *
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
import os

# Basic production hardening
DEBUG = False

# Require SECRET_KEY set in environment for prod
SECRET_KEY = env('SECRET_KEY')

# Trust proxy headers when behind a load balancer
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_SECURE = True

SECURE_SSL_REDIRECT = env.bool('SECURE_SSL_REDIRECT', default=True)
SECURE_HSTS_SECONDS = env.int('SECURE_HSTS_SECONDS', default=60)
SECURE_HSTS_INCLUDE_SUBDOMAINS = env.bool('SECURE_HSTS_INCLUDE_SUBDOMAINS', default=True)
SECURE_HSTS_PRELOAD = env.bool('SECURE_HSTS_PRELOAD', default=True)
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['.example.com'])

# Static files: allow overriding STATIC_URL to use CDN in production
STATIC_URL = env('STATIC_URL', default='/static/')
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Optional CDN URL for referencing static assets directly
if STATIC_URL.startswith('http'):
	# When using an external CDN, WhiteNoise is still useful for collectstatic
	WHITENOISE_USE_FINDERS = True

# Content Security Policy (optional) — requires `django-csp` if you want middleware enforcement
CSP_DEFAULT_SRC = ("'self'",)
CSP_SCRIPT_SRC = ("'self'", 'https://cdnjs.cloudflare.com')
CSP_STYLE_SRC = ("'self'", 'https://fonts.googleapis.com')
CSP_FONT_SRC = ("'self'", 'https://fonts.gstatic.com')

# Sentry
SENTRY_DSN = env('SENTRY_DSN', default=None)
if SENTRY_DSN:
	sentry_sdk.init(
		dsn=SENTRY_DSN,
		integrations=[DjangoIntegration()],
		traces_sample_rate=env.float('SENTRY_TRACES_SAMPLE_RATE', default=0.0),
		send_default_pii=env.bool('SENTRY_SEND_DEFAULT_PII', default=False),
		environment=env('SENTRY_ENVIRONMENT', default='production'),
	)

# Optional: configure media to use S3 via django-storages when AWS_* env vars present
if env.bool('USE_S3', default=False):
	# Requires django-storages and boto3
	DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
	AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID')
	AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY')
	AWS_STORAGE_BUCKET_NAME = env('AWS_STORAGE_BUCKET_NAME')
	AWS_S3_REGION_NAME = env('AWS_S3_REGION_NAME', default=None)
	AWS_S3_CUSTOM_DOMAIN = env('AWS_S3_CUSTOM_DOMAIN', default=None)
	if AWS_S3_CUSTOM_DOMAIN:
		MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'
	else:
		MEDIA_URL = f'https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/'

# Logging — keep simple and let Sentry capture exceptions when configured
LOGGING = {
	'version': 1,
	'disable_existing_loggers': False,
	'formatters': {
		'verbose': {
			'format': '[%(asctime)s] %(levelname)s %(name)s %(message)s'
		},
	},
	'handlers': {
		'console': {
			'class': 'logging.StreamHandler',
			'formatter': 'verbose',
		},
	},
	'root': {
		'handlers': ['console'],
		'level': 'INFO',
	},
}

# Ensure debug information is not leaked
DEBUG_PROPAGATE_EXCEPTIONS = False
from .base import *

DEBUG = False

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['.example.com'])
