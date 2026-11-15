from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Q

from profile.models import Customer, Groomer

# Create your models here.
class ApplicationUser(AbstractUser):
    customer = models.ForeignKey(Customer, on_delete=models.RESTRICT, null=True, blank=True)
    groomer = models.ForeignKey(Groomer, on_delete=models.RESTRICT, null=True, blank=True)

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