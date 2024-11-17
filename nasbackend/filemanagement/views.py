from django.shortcuts import render
from django.views.decorators.http import require_GET, require_POST
from django.http import HttpResponse
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
        return HttpResponse("Login Successful")
    else:
        return HttpResponse("No such user exists")

@require_POST
def upload_files(request):

    print(dir(request))
    print(request.FILES)
    # I can assume now that only GET or POST requests make it this far
    # ...
    return HttpResponse("Response sent")