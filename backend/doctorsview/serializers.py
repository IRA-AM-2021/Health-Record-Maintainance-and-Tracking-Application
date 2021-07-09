from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import DoctorAccount


class DoctorAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAccount
        fields = ("id", "name", "hospital_id", "dept", "app_id", "email", "password_before_verification",
                  "mobile_no", "fb_url", "tweet_url", "insta_url", "background", "doctor_id", "joined_date", "created_at", "logo", "address","password", "email_Verified")
        
        """    extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance """


class CheckDoctorAccountAvailableSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAccount
        fields = ("id", "name", "hospital_id", "dept", "app_id", "email", "password_before_verification",
                  "mobile_no", "background",  "fb_url", "tweet_url", "insta_url", "doctor_id", "joined_date", "created_at", "logo", "address", "email_Verified")
