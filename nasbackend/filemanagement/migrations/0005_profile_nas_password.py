# Generated by Django 5.1.3 on 2024-11-18 06:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "filemanagement",
            "0004_rename_user_level_read_permission_permissions_user_permissions_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="nas_password",
            field=models.CharField(default="maxi", max_length=200),
            preserve_default=False,
        ),
    ]