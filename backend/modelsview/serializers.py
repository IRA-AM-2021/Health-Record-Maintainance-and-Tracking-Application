from rest_framework import serializers
from .models import HospitalAccounts,Department

class HospitalAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model=HospitalAccounts
        fields = ("id", "hospital_name", "hospital_id", "branch", "user_id", "email",
                  "mobile_no", "address", "pincode", "logo", "is_email_Verified", "password", "created_at")
        extra_kwargs={
            'password':{'write_only':True}
        }

    def create(self,validated_data):
        password=validated_data.pop('password')
        instance=self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class DepartmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Department
        fields = '__all__'
