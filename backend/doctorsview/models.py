from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
def upload_path(instance,filename):
    return '/'.join(['uploads/images/doctors',str(instance.app_id),filename])

class DoctorAccount(models.Model):
    logo = models.ImageField(
        upload_to=upload_path, blank=True, default='uploads/images/doctors/icon.png')
    background = models.ImageField(
        upload_to=upload_path, blank=True, default='uploads/images/doctors/bg.jpg')
    name = models.CharField(max_length=60)
    email = models.EmailField(max_length=100, unique=True)
    hospital_id = models.CharField(max_length=100, default='')
    doctor_id = models.CharField(max_length=40, unique=True)
    app_id = models.CharField(max_length=30, unique=True)
    address = models.CharField(max_length=150, default='')
    dept = models.CharField(max_length=200)
    fb_url = models.URLField(default='')
    tweet_url = models.URLField(default='')
    insta_url = models.URLField(default='')
    mobile_no = models.CharField(max_length=20, unique=True, null=True)
    password = models.CharField(max_length=255,default='')
    email_Verified = models.BooleanField(default=False)
    password_before_verification = models.CharField(max_length=255)
    joined_date= models.DateField()
    verify_token=models.CharField(max_length=250, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    
    
    # username = None

    # USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = []
