from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Profile

class GetUsersSerializer(serializers.ModelSerializer):
    user_level = serializers.SerializerMethodField()

    def get_user_level(self, obj):
        profile = Profile.objects.get(user_id = obj.id)
        return profile.user_level

    class Meta:
        model = User
        fields = ["id", "username", "user_level"]