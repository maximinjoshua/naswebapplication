from django.shortcuts import render
from django.views.decorators.http import require_GET, require_POST
from django.http import HttpResponse, QueryDict, JsonResponse
from django.contrib.auth import authenticate, login
from django.db import IntegrityError, transaction
from django.conf import settings

from django.contrib.auth.models import User
from .models import Profile, Files
import json
import os
import paramiko

from .serializers import GetUsersSerializer
from rest_framework.decorators import api_view

@require_POST
def register(request):
    with transaction.atomic():
        data = json.loads(request.body)
        print(data, "Data")
        user = User.objects.create_user(**data)
        if user:
            Profile.objects.create(user = user, user_level = 2)
        return HttpResponse("Registered successfully")

@require_POST
def login(request):
    data = json.loads(request.body)
    user = authenticate(request, **data)
    if user:
        profile_instance = Profile.objects.get(user=user)
        user_level = profile_instance.user_level
        return JsonResponse(data = {"user_level": user_level, "user_id": user.id})
    else:
        return JsonResponse(data={"error": "User not found"}, status=401)
    
@require_GET
def get_user_profile(request):
    user_id = request.GET.get("user_id", None)

    profile_instance = Profile.objects.get(user_id = user_id)
    if profile_instance:
        return JsonResponse(data = {"user_level": profile_instance.user_level})
    else:
        return JsonResponse(data = {"error": "Profile not found"}, status=500)

@require_POST
def upload_files(request):

    # print(dir(request))
    data = QueryDict.dict(request.POST)

@api_view(['GET'])
def get_all_users(request):
    users = User.objects.prefetch_related('profile').filter(profile__user_level = 2)
    user_serializer = GetUsersSerializer(users, many = True)
    return JsonResponse(data = {"data": user_serializer.data})

@api_view(['PUT'])
def edit_user_level(request):
    data = json.loads(request.body)

    profile_instance = Profile.objects.get(user_id = data["user_id"])
    profile_instance.user_level = data["user_level"]
    profile_instance.save()

    return JsonResponse(data = {"message": "Updated Successfully"})
