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
from profile.views import (
    CustomerViewSet,
    GroomerViewSet,
    NoteViewSet,
    PublicGroomerAvailabilityView,
    PublicGroomerViewSet,
)

from appointment.views import AppointmentViewSet, ServiceViewSet
from authentication.views import CustomerCreateAPIView, GroomerCreateAPIView
from django.urls import include, path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'api/customer', CustomerViewSet)
router.register(r'api/public/groomer', PublicGroomerViewSet, basename='public-groomer')
router.register(r'api/groomer', GroomerViewSet)
router.register(r'api/service', ServiceViewSet)
router.register(r'api/appointment', AppointmentViewSet, basename='appointment')
router.register(r'api/dog/(?P<dog>\d+)/note', NoteViewSet, basename='note')

urlpatterns = router.urls
urlpatterns += [
    path(r'api/auth/', include('dj_rest_auth.urls')),
    path(r'api/public/groomer/<int:pk>/availability', PublicGroomerAvailabilityView.as_view()),
    path(r'api/auth/create/customer/', CustomerCreateAPIView.as_view(), name="customer-create"),
    path(r'api/auth/create/groomer/', GroomerCreateAPIView.as_view(), name="groomer-create")
]
