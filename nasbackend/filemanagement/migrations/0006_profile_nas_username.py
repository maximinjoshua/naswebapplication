# Generated by Django 5.1.3 on 2024-11-18 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("filemanagement", "0005_profile_nas_password"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="nas_username",
            field=models.CharField(default="passwordstring", max_length=200),
            preserve_default=False,
        ),
    ]
