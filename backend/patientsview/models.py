from django.db import models
from django.db.models import JSONField

# Create your models here.

def upload_path(instance, filename):
    return '/'.join(['uploads/images/patients', str(instance.app_id), filename])

class PatientAccount(models.Model):
    logo = models.ImageField(upload_to=upload_path, blank=True, default='uploads/images/patients/icon.png')
    patient_name = models.CharField(max_length=60)
    email = models.EmailField(max_length=100, unique=True)
    account_created_hospital_id = models.CharField(max_length=100)
    app_id = models.CharField(max_length=30, unique=True)
    address = models.CharField(max_length=250, default='')
    mobile_no = models.CharField(max_length=20, unique=True, null=True)
    password = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    aadhar_number=models.CharField(max_length=30,unique=True,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    email_verified = models.BooleanField(default=False)
    mobile_verified = models.BooleanField(default=False)
    otp_code=models.CharField(max_length=10,default='')

class PatientsHistory(models.Model):
    hospital_id=models.CharField(max_length=100)
    aadhar_number = models.CharField(max_length=30,default='')
    doctor_id = models.CharField(max_length=100)
    symptoms=models.TextField(null=True)
    cause=models.CharField(max_length=60)
    description = models.TextField()
    revisit_date=models.DateField()
    entered_date=models.DateTimeField(auto_now_add=True)
    verified=models.BooleanField(default=False)
    verify_token = models.CharField(max_length=255,default='')

class PatientsTestFiles(models.Model):
    hospital_id=models.CharField(max_length=100)
    app_id = models.CharField(max_length=30)
    tested_files=models.FileField()
    doctor_id = models.CharField(max_length=100)
    verified=models.BooleanField(default=False)
    verify_token = models.CharField(max_length=255)
    entered_date=models.DateTimeField(auto_now_add=True)
