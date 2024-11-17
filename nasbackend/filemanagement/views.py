from django.shortcuts import render
from django.views.decorators.http import require_GET, require_POST
from django.http import HttpResponse, QueryDict, JsonResponse
from django.contrib.auth import authenticate, login
from django.db import IntegrityError, transaction

from django.contrib.auth.models import User
from .models import Profile
import json

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
    data = json.loads(request.body)
    profile_instance = Profile.objects.get(user_id = data["user_id"])
    if profile_instance:
        return JsonResponse(data = {"user_level": profile_instance.user_level})
    else:
        return JsonResponse(data = {"error": "Profile not found"}, status=500)

@require_POST
def upload_files(request):

    # print(dir(request))
    data = QueryDict.dict(request.POST)
    print(data)

    print(request.FILES)
    # I can assume now that only GET or POST requests make it this far
    # ...
    return HttpResponse("Response sent")