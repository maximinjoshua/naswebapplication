# Generated by Django 5.1.3 on 2024-11-13 14:55

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Folders",
            fields=[
                ("id", models.BigAutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=100)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "created_by",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.RESTRICT,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "parent_folder_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="filemanagement.folders",
                    ),
                ),
            ],
            options={
                "db_table": "folders",
            },
        ),
        migrations.CreateModel(
            name="Files",
            fields=[
                ("id", models.BigAutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=100)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "created_by",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.RESTRICT,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "parent_folder_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="filemanagement.folders",
                    ),
                ),
            ],
            options={
                "db_table": "files",
            },
        ),
    ]