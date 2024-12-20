from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Profile, Files, Permissions

class GetUsersSerializer(serializers.ModelSerializer):
    user_level = serializers.SerializerMethodField()

    def get_user_level(self, obj):
        profile = Profile.objects.filter(user_id = obj.id).first()
        if profile:
            return profile.user_level
        else:
            return None

    class Meta:
        model = User
        fields = ["id", "username", "user_level"]

class GetFilesSerializer(serializers.ModelSerializer):
    user_permissions = serializers.CharField()
    
    class Meta:
        model = Files
        fields = ["id", "name", "user_permissions"]