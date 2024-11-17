"""
URL configuration for nasbackendproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from filemanagement.views import (upload_files, register, login, get_user_profile, get_all_users,
                                  edit_user_level)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("uploadfiles", upload_files),
    path("register/", register),
    path("getuserprofile/", get_user_profile),
    path("login/", login),
    path("getallusers/", get_all_users),
    path("edituserlevel/", edit_user_level)
]
