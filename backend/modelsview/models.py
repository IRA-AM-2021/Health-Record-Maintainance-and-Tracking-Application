from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class HospitalAccounts(AbstractUser):
    hospital_name=models.CharField(max_length=200)
    hospital_id = models.CharField(max_length=60, unique=True)
    address=models.TextField(blank=True, null=True)
    branch=models.CharField(max_length=40)
    pincode=models.CharField(max_length=10,blank=True, null=True)
    user_id = models.CharField(max_length=100, unique=True)
    email=models.EmailField(max_length=100, unique=True)
    mobile_no = models.CharField(max_length=20, unique=True)
    password=models.CharField(max_length=250)
    created_at=models.DateTimeField(auto_now_add=True)
    logo = models.ImageField(upload_to="uploads/images", blank=True, default='uploads/images/admin-avatar.png')
    email_verification_token = models.CharField(max_length=200,null=True, blank=True)
    forgot_password_token = models.CharField(max_length=200, null=True, blank=True)
    otp_code= models.CharField(max_length=10, null=True, blank=True)
    is_email_Verified=models.BooleanField(default=False)
    is_phone_Verified=models.BooleanField(default=False)
    username=None

    USERNAME_FIELD='email'
    REQUIRED_FIELDS=[]

    # def __str__(self):
    #     return self.hospital_name

    # class Meta:
    #     db_table="HospitalAccounts"

class Department(models.Model):
    user_id = models.CharField(max_length=100)
    department= models.CharField(max_length=100)
