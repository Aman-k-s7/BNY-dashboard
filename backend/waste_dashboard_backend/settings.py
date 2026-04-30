from pathlib import Path
import os


BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIST_DIR = BASE_DIR / "frontend_dist"


def _load_local_env() -> None:
    env_path = BASE_DIR / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", maxsplit=1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key:
            os.environ.setdefault(key, value)


_load_local_env()


def _split_csv_env(name: str) -> list[str]:
    return [item.strip() for item in os.getenv(name, "").split(",") if item.strip()]


def _is_placeholder_host(value: str) -> bool:
    normalized = value.strip().lower()
    return normalized in {"your-domain.com", "example.com", "localhost"}


def _allowed_hosts() -> list[str]:
    hosts = [host for host in _split_csv_env("DJANGO_ALLOWED_HOSTS") if not _is_placeholder_host(host)]
    return hosts or ["*"]


def _csrf_trusted_origins() -> list[str]:
    origins = []
    for origin in _split_csv_env("DJANGO_CSRF_TRUSTED_ORIGINS"):
        host_part = origin.split("://", maxsplit=1)[-1]
        if _is_placeholder_host(host_part):
            continue
        origins.append(origin)
    return origins

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "django-insecure-local-dev-key")
DEBUG = os.getenv("DJANGO_DEBUG", "true").lower() == "true"
ALLOWED_HOSTS = _allowed_hosts()
CSRF_TRUSTED_ORIGINS = _csrf_trusted_origins()

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "analytics",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "waste_dashboard_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]

WSGI_APPLICATION = "waste_dashboard_backend.wsgi.application"
ASGI_APPLICATION = "waste_dashboard_backend.asgi.application"

if os.getenv("MYSQL_NAME"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": os.getenv("MYSQL_NAME"),
            "USER": os.getenv("MYSQL_USER", ""),
            "PASSWORD": os.getenv("MYSQL_PASSWORD", ""),
            "HOST": os.getenv("MYSQL_HOST", "127.0.0.1"),
            "PORT": os.getenv("MYSQL_PORT", "3306"),
            "OPTIONS": {
                "charset": "utf8mb4",
            },
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

LANGUAGE_CODE = "en-us"
TIME_ZONE = os.getenv("DJANGO_TIME_ZONE", "Asia/Calcutta")
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [FRONTEND_DIST_DIR] if FRONTEND_DIST_DIR.exists() else []
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
