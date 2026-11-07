"""
URL configuration for mobile_dog_grooming project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
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
from rest_framework.routers import DefaultRouter
from django.contrib import admin
from django.urls import path

from appointment.views import ServiceViewSet, AppointmentViewSet
from profile.views import CustomerViewSet, GroomerViewSet

router = DefaultRouter()
router.register(r'api/customer', CustomerViewSet)
router.register(r'api/groomer', GroomerViewSet)
router.register(r'api/service', ServiceViewSet)
router.register(r'api/appointment', AppointmentViewSet)

urlpatterns = router.urls
urlpatterns += [
    path('admin/', admin.site.urls),
]
