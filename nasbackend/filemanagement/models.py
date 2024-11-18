from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Profile(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_level = models.IntegerField()
    nas_username = models.CharField(max_length=200)
    nas_password = models.CharField(max_length=200)

    class Meta:
        db_table = 'profile'

class Folders(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    parent_folder = models.ForeignKey('self', on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now = True)
    created_by = models.ForeignKey(User, on_delete=models.RESTRICT)

    def get_full_path(self):
        if self.parent_folder:
            return f"{self.parent_folder.get_full_path()}/{self.name}"
        return self.name

    class Meta:
        db_table = 'folders'

class Files(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    parent_folder = models.ForeignKey(Folders, on_delete=models.CASCADE, null = True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now = True)
    created_by = models.ForeignKey(User, on_delete=models.RESTRICT)

    def get_full_path(self):
        if self.parent_folder:
            return f"{self.parent_folder.get_full_path()}/{self.name}"
        return self.name
    
    class Meta:
        db_table = 'files'

class Permissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    file = models.ForeignKey(Files, on_delete=models.CASCADE)
    user_level = models.IntegerField()
    user_permissions = models.CharField(max_length=10)

    class Meta:
        db_table = 'filepermissions'
