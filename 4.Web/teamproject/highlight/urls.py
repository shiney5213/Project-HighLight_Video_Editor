"""teamproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
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
from django.urls import path, include
from highlight import views
app_name = 'highlight'
urlpatterns = [
    # path('', views.index),
    # path('output', views.output),
    # path('', views.input),
    # path('upload', views.upload),   # highlight/upload
    # path('videoedit', views.video_edit),   # highlight/upload
    path('videoedit', views.uploadView.as_view(), name = 'vidoedit'),
    path('download', views.downloadView.as_view(), name = 'download'),   # highlight/download
    # path('download', views.download),   # highlight/download
    path('upload', views.uploadView.as_view(), name = 'upload'),
    # path('admin/', admin.site.urls),
]
