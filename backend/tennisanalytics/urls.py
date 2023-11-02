"""
URL configuration for tennisanalytics project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from tennisanalytics import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home),
    
    path('api/user', views.user),

    path('api/matches/', views.matches),
    path('api/matches/create', views.createMatch),
    path('api/matches/join', views.joinMatch),
    path('api/matches/leave', views.leaveMatch),
    path('api/matches/complete', views.completeMatch),

    path('api/matches/completed', views.completedMatches),
    
    path('api/diagnostics', views.diagnostics),
    path('api/diagnostics/create', views.createDiagnostic),

    path('movies/<int:id>', views.detail),
    path('movies/<int:id>/delete', views.delete),

]
