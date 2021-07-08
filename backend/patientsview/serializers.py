from rest_framework import serializers
from .models import PatientAccount, PatientsHistory

class PatientAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model=PatientAccount
        fields = ("id", "patient_name", "account_created_hospital_id", "app_id", "email",
                  "mobile_no", "aadhar_number", "date_of_birth", "created_at", "logo", "address", "email_verified", "mobile_verified")

class PatientsHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model=PatientsHistory
        fields="__all__"
