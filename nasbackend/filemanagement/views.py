from django.shortcuts import render
from django.views.decorators.http import require_GET, require_POST
from django.http import HttpResponse, QueryDict, JsonResponse
from django.contrib.auth import authenticate, login
from django.db import IntegrityError, transaction
from django.conf import settings
from django.db.models import Q
from django.db import models

from django.contrib.auth.models import User
from .models import Profile, Files, Permissions
import json
import os
import paramiko

from .serializers import GetUsersSerializer, GetFilesSerializer
from rest_framework.decorators import api_view

storage_path = './filestorage/'

def get_sftp_access(nas_username, nas_password):
    # samba config
    nas_host = settings.NAS_HOST

    # ssh config
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(nas_host, username=nas_username, password=nas_password)
    sftp = ssh.open_sftp()

    return sftp

def get_ssh_access(nas_username, nas_password):
    nas_host = settings.NAS_HOST

    print(nas_username, "nas username")
    print(nas_password, "nas password")

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(nas_host, username=nas_username, password=nas_password)
    return ssh

@require_POST
def register(request):
    with transaction.atomic():
        data = json.loads(request.body)
        user = User.objects.create_user(**data)

        if user:
            Profile.objects.create(user = user, user_level = 2, nas_password = data["password"])

        # add a linux user for each register
        ssh = get_ssh_access(settings.NAS_ROOT_USERNAME, settings.NAS_ROOT_PASSWORD)
        useradd_command = f"sudo useradd -m {user.username}"
        stdin, stdout, stderr = ssh.exec_command(useradd_command)
        stdin.flush()

        # Set the user's password
        passwd_command = f"echo '{user.username}:{data["password"]}' | sudo chpasswd"
        stdin, stdout, stderr = ssh.exec_command(passwd_command)

        # add samba user
        samba_useradd = f"sudo smbpasswd -a {user.username}"
        stdin, stdout, stderr = ssh.exec_command(samba_useradd)

        # enable samba user
        samba_userenable = f"sudo smbpasswd -e {user.username}"
        stdin, stdout, stderr = ssh.exec_command(samba_userenable)

        # set acl of nas folder
        set_acl_command = f"sudo setfacl -R -m u:{user.username}:rw {settings.NAS_TARGET_PATH}"
        stdin, stdout, stderr = ssh.exec_command(set_acl_command)
        
        # Check for any errors
        errors = stderr.read().decode('utf-8')
        if errors:
            print(f"Error: {errors}")
        else:
            print(f"User '{user.username}' created successfully with password.")

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
    data = QueryDict.dict(request.POST)
    print(data, "Data")
    data["folder_id"] = None if data["folder_id"] == 'null' else data["folder_id"]

    print(data, "data printed")

    uploaded_files = request.FILES.getlist('file')

    file_id_list = []

    nas_username = "maximin-joshua-michael-edison"
    nas_password = "maxi"

    sftp = get_sftp_access(nas_username, nas_password)

    nas_target_path = settings.NAS_TARGET_PATH

    for uploaded_file in uploaded_files:
        temp_file_path = os.path.join(storage_path, uploaded_file.name)
        with open(temp_file_path, "wb+") as temp_file:
            for chunk in uploaded_file.chunks():
                temp_file.write(chunk)

        remote_file_path = os.path.join(nas_target_path, uploaded_file.name)
        sftp.put(temp_file_path, remote_file_path)

        file_instance = Files(name=uploaded_file.name, parent_folder_id = data["folder_id"], created_by_id = data["user_id"])
        file_instance.save()
        file_id_list.append(file_instance.id)

    return JsonResponse(data = {"message": "File saved successfully", "file_id_list": file_id_list})

@api_view(['POST'])
def create_permission_entry(request):
    data = json.loads(request.body)

    for file_id in data["file_id_list"]:
        for user_level in data["permissions_object"].keys():
            # create a permission entry for each file
            permission_instance = Permissions(file_id = file_id, user_level = user_level,
                                            user_permissions = data["permissions_object"][user_level])
            permission_instance.save()
    return JsonResponse(data = {"message": "File saved successfully"})

@api_view(['GET'])
def get_files(request):
    parent_folder_id = request.GET.get("parent_folder_id", None)
    user_level = request.GET.get("user_level", None)

    parent_folder_id = parent_folder_id if parent_folder_id else None
    
    # raw query
    files_query = f"""SELECT f.id, f.name, fp.user_permissions as user_permissions
                    FROM files f
                    JOIN filepermissions fp ON fp.file_id =  f.id
                    WHERE f.parent_folder_id {"=" + str(parent_folder_id) if parent_folder_id !=None else "IS NULL"}
                    AND fp.user_permissions IN ('rw','r')
                    AND fp.user_level = {user_level}"""
    
    files = Files.objects.raw(files_query)

    files_serializer = GetFilesSerializer(files, many = True)

    return JsonResponse(data={"data": files_serializer.data})


@api_view(['GET'])
def get_all_users(request):
    users = User.objects.all()
    user_serializer = GetUsersSerializer(users, many = True)
    return JsonResponse(data = {"data": user_serializer.data})

@api_view(['PUT'])
def edit_user_level(request):
    data = json.loads(request.body)

    profile_instance = Profile.objects.get(user_id = data["user_id"])
    profile_instance.user_level = data["user_level"]
    profile_instance.save()

    return JsonResponse(data = {"message": "Updated Successfully"})



