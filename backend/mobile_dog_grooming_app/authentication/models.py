from typing import ClassVar

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.db.models import Q

from profile.models import Customer, Groomer

# Create your models here.
class CustomUserManager(BaseUserManager["ApplicationUser"]):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)
    
class ApplicationUser(AbstractUser):
    username = None
    customer = models.ForeignKey(Customer, on_delete=models.RESTRICT, null=True, blank=True, unique=True)
    groomer = models.ForeignKey(Groomer, on_delete=models.RESTRICT, null=True, blank=True, unique=True)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects: ClassVar[CustomUserManager] = CustomUserManager() # type: ignore[assignment]

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=(
                    Q(is_superuser=True)
                    | (
                        Q(customer__isnull=False, groomer__isnull=True)
                        | Q(customer__isnull=True, groomer__isnull=False)
                    )
                ),
                name="user_must_be_either_customer_or_groomer",
                violation_error_message="User must be marked as either a Customer or Groomer"
            )
        ]