from django.core.management.base import BaseCommand
from django.conf import settings
import os
import subprocess
import datetime
import tempfile

try:
    import boto3
except Exception:
    boto3 = None


class Command(BaseCommand):
    help = 'Create a backup of the database and (optionally) sync media to S3.'

    def add_arguments(self, parser):
        parser.add_argument('--output-dir', default=None, help='Directory to write backups to')

    def handle(self, *args, **options):
        out_dir = options['output_dir'] or os.environ.get('BACKUP_OUTPUT_DIR') or '.'
        os.makedirs(out_dir, exist_ok=True)
        ts = datetime.datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')

        db_url = settings.DATABASES['default'].get('ENGINE', '')

        # Attempt pg_dump when DATABASES configured for postgres via DATABASE_URL
        db_name = None
        try:
            engine = settings.DATABASES['default'].get('ENGINE', '')
        except Exception:
            engine = ''

        backup_files = []

        if 'postgresql' in engine or 'postgres' in engine:
            filename = os.path.join(out_dir, f'db-backup-{ts}.sql.gz')
            self.stdout.write(f'Running pg_dump -> {filename}')
            # Use pg_dump from env; requires pg client available and DATABASE_URL accessible
            database_url = os.environ.get('DATABASE_URL')
            if not database_url:
                self.stderr.write('DATABASE_URL env var is required for pg_dump')
            else:
                # Use pg_dump via subprocess, pipe to gzip
                with open(filename, 'wb') as f:
                    proc = subprocess.Popen(['bash', '-lc', f'pg_dump "{database_url}" | gzip -c'], stdout=f)
                    proc.wait()
                backup_files.append(filename)
        else:
            # Fallback to Django dumpdata
            filename = os.path.join(out_dir, f'django-fixtures-{ts}.json')
            self.stdout.write(f'Running dumpdata -> {filename}')
            with open(filename, 'w', encoding='utf-8') as f:
                from django.core import management

                management.call_command('dumpdata', stdout=f)
            backup_files.append(filename)

        # Sync media to S3 if AWS credentials and bucket configured
        s3_bucket = os.environ.get('BACKUP_S3_BUCKET') or os.environ.get('AWS_S3_BUCKET')
        if boto3 and s3_bucket and settings.MEDIA_ROOT:
            self.stdout.write(f'Uploading media to s3://{s3_bucket}/media-backups/{ts}/')
            s3 = boto3.client('s3')
            # Walk media root and upload files
            for root, dirs, files in os.walk(settings.MEDIA_ROOT):
                for fn in files:
                    full = os.path.join(root, fn)
                    key = os.path.join('media-backups', ts, os.path.relpath(full, settings.MEDIA_ROOT))
                    s3.upload_file(full, s3_bucket, key)

        self.stdout.write(self.style.SUCCESS(f'Backup complete. Files: {backup_files}'))
