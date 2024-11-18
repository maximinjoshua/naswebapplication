from django.shortcuts import render
from django.views.decorators.http import require_GET, require_POST
from django.http import HttpResponse, QueryDict, JsonResponse
from django.contrib.auth import authenticate, login
from django.db import IntegrityError, transaction
from django.conf import settings
from django.db.models import Q
from django.db import models

from django.contrib.auth.models import User
from .models import Profile, Files, Permissions, Folders
import json
import os
import paramiko
import random

from .serializers import GetUsersSerializer, GetFilesSerializer
from rest_framework.decorators import api_view
from smbclient import open_file

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
    # nas_username=settings.NAS_ROOT_USERNAME
    # nas_password=settings.NAS_ROOT_PASSWORD

    print(nas_username, "nas username")
    print(nas_password, "nas password")

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(nas_host, username=nas_username, password=nas_password)
    return ssh

def get_username_password_smb(user_id):
    user_instance = User.objects.get(id = user_id)
    if user_instance:
        profile_instance = Profile.objects.get(user_id=user_id)

    return {"user_name": user_instance.username, "smb_password": profile_instance.nas_password}

# def create_smb_client_instance(user_name, password):
#     smb = smbclient.SambaClient(server= settings.NAS_HOST, share=settings.NAS_TARGET_PATH, 
#                                 username=user_name, password=password)
#     return smb

def permission_level_mapping(permission_list):
    permission_dict = {}
    if 1 in permission_list:
        permission_dict[0] = 'r'
    if 2 in permission_list:
        permission_dict[0] = 'rw'
    if 3 in permission_list:
        permission_dict[1] = 'r'
    if 4 in permission_list:
        permission_dict[1] = 'rw'
    if 5 in permission_list:
        permission_dict[2] = 'r'
    if 6 in permission_list:
        permission_dict[2] = 'rw'

    return permission_dict

@require_POST
def register(request):
    with transaction.atomic():
        data = json.loads(request.body)
        user = User.objects.create_user(**data)

        if user:
            # generate a random user name for the user
            # email_name = user.username.split('@', 1)[0]
            # linux_user_name = f"{email_name}{str(random.randint(0,999))}"
            linux_user_name = user.username
            Profile.objects.create(user = user, user_level = 2, nas_password = data["password"], nas_username = linux_user_name)

            # # add a linux user for each register
            # ssh = get_ssh_access(settings.NAS_ROOT_USERNAME, settings.NAS_ROOT_PASSWORD)
            # # useradd_command = f"sudo useradd -m {user.username}"
            # # stdin, stdout, stderr = ssh.exec_command(useradd_command)
            # # print(stderr.read().decode('utf-8'), "err")
            # # print(stdout, "out")

            # add_usercommand = f"""echo -e "{data["password"]}\n{data["password"]}\n{linux_user_name}\n\n\n\n\ny" | sudo adduser {linux_user_name} --allow-bad-names"""
            # stdin, stdout, stderr = ssh.exec_command(add_usercommand)
            # print(stderr.read().decode('utf-8'), "err")
            # print(stdout, "out")

            # # # Set the user's password
            # # passwd_command = f"echo '{user.username}:{data["password"]}' | sudo chpasswd"
            # # stdin, stdout, stderr = ssh.exec_command(passwd_command)
            # # print(stderr.read().decode('utf-8'), "err")
            # # print(stdout, "out")
            # # # ssh.close()

            # # ssh = get_ssh_access(settings.NAS_ROOT_USERNAME, settings.NAS_ROOT_PASSWORD)
            # # add samba user
            # samba_useradd = f'echo -e "{data["password"]}\n{data["password"]}" |sudo smbpasswd -a {linux_user_name}'
            # stdin, stdout, stderr = ssh.exec_command(samba_useradd)
            # print(stderr.read().decode('utf-8'), "err")
            # print(stdout, "out")

            # # enable samba user
            # samba_userenable = f"sudo smbpasswd -e {linux_user_name}"
            # stdin, stdout, stderr = ssh.exec_command(samba_userenable)
            # print(stderr.read().decode('utf-8'), "err")
            # print(stdout, "out")

            # # ssh.close()

            # # set acl of nas folder
            # set_acl_command = f"sudo setfacl -R -m u:{linux_user_name}:rwx {settings.NAS_TARGET_PATH}"
            # stdin, stdout, stderr = ssh.exec_command(set_acl_command)
            
            # # Check for any errors
            # errors = stderr.read().decode('utf-8')
            # if errors:
            #     print(f"Error: {errors}")
            # else:
            #     print(f"User '{linux_user_name}' created successfully with password.")

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
    
api_view(['DELETE'])
def delete_user(request):
    user_id = request.GET.get("user_id", None)

    user_instance = User.objects.get(id = user_id)
    user_instance.delete()
    
    return JsonResponse(data={"message": "User deleted"})
    
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
    with transaction.atomic():
        data = QueryDict.dict(request.POST)
        print(data, "Data")
        data["folder_id"] = None if data["folder_id"] == 'null' else data["folder_id"]

        print(data, "data printed")

        uploaded_files = request.FILES.getlist('file')

        file_id_list = []

        # nas_username = "maximin-joshua-michael-edison"
        # nas_password = "maxi"

        # sftp = get_sftp_access(nas_username, nas_password)

        nas_target_path = settings.NAS_TARGET_PATH

        for uploaded_file in uploaded_files:
            temp_file_path = os.path.join(storage_path, uploaded_file.name)
            with open(temp_file_path, "wb+") as temp_file:
                for chunk in uploaded_file.chunks():
                    temp_file.write(chunk)

            remote_file_path = os.path.join(nas_target_path, uploaded_file.name)
            # sftp.put(temp_file_path, remote_file_path)

            user_creds = get_username_password_smb(data["user_id"])
            print(user_creds, "user creds")
            # smb = create_smb_client_instance(user_creds["user_name"], user_creds["smb_password"])
            # # samba upload
            # print(temp_file_path ,"tempfilepath")
            # print(remote_file_path, "remote filepath")
            # smb.upload(temp_file_path, f"\\192.168.56.101\externalaccessibleshare\{uploaded_file.name}")

            # Open the remote file for writing and upload the content
            with open_file(r"\\192.168.56.101\externalaccessibleshare\\" + uploaded_file.name, mode="wb", 
                           username=user_creds["user_name"], password=user_creds["smb_password"]) as remote_file:
                with open(temp_file_path, mode="rb") as local_file:
                    remote_file.write(local_file.read())

            # update file table in my sql
            file_instance = Files(name=uploaded_file.name, parent_folder_id = data["folder_id"], created_by_id = data["user_id"])
            file_instance.save()
            file_id_list.append(file_instance.id)

        return JsonResponse(data = {"message": "File saved successfully", "file_id_list": file_id_list})

@api_view(['POST'])
def create_permission_entry(request):
    data = json.loads(request.body)

    for file_id in data["file_id_list"]:
        permission_object = permission_level_mapping(data["permissions_object"])
        for user_level in permission_object.keys():
            # create a permission entry for each file
            permission_instance = Permissions(file_id = file_id, user_level = user_level,
                                            user_permissions = permission_object[user_level])
            permission_instance.save()

        # change permissions in nas drive
        # first loop through the folder table to get the complete file path
        file_instance = Files.objects.get(id = file_id)
        file_path = file_instance.get_full_path()
        
        

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

@api_view(['POST'])
def create_folder(request):
    data = json.loads(request.body)

    folder_instance = Folders(parent_folder_id = data["parent_folder_id"], created_by_id=data["user_id"],
                              name = data["name"])
    folder_instance.save()



    ssh = get_ssh_access()
    # create a folder in the smb share
    samba_useradd = f"sudo mkdir {os.path.join(settings.NAS_TARGET_PATH, data["name"])}"
    ssh.exec_command(samba_useradd)

    return JsonResponse(data = {"message": "Created Successfully"})


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



