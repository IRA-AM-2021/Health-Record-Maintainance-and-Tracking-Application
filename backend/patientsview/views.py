from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from rest_framework.serializers import Serializer
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PatientAccount, PatientsHistory
from .serializers import PatientAccountSerializer, PatientsHistorySerializer
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework import generics
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.parsers import JSONParser, ParseError
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import make_password
from django.conf import settings
from datetime import datetime
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password, check_password
import jwt
import json
import uuid
import os
import vonage
import random
import math
from dotenv import load_dotenv

load_dotenv()

# Create your views here.
class PatientRegistrationView(CreateAPIView):
    def post(self, request):
        serializer = PatientAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.save():
            return Response({
                "message":"successfully Registered"
            })
        return Response(serializer.data)

class PatientsListsView(APIView):
    def get(self, request):
        token = request.COOKIES.get('20mxJAM')
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        try:
            payload = jwt.decode(token, 'secret', algorithm=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')
        patients = PatientAccount.objects.filter(account_created_hospital_id=payload['hospital_id']).all()
        serializer = PatientAccountSerializer(patients, many=True)
        return JsonResponse(serializer.data, safe=False)

class PatientsView(APIView):
    def get(self, request):
        patients = PatientAccount.objects.all()
        serializer = PatientAccountSerializer(patients, many=True)
        return JsonResponse(serializer.data, safe=False)

class PatientsDataView(APIView):
    def get(self, request):
        aadhar_number = request.GET['aadhar_number']
        user = PatientAccount.objects.filter(aadhar_number=aadhar_number).first()
        serializer = PatientAccountSerializer(user)
        return Response(serializer.data)

class PatientLoginSentOTPView(APIView):
    def post(self,request):
        aadhar_number = request.data['aadhar_number']
        user = PatientAccount.objects.filter(aadhar_number=aadhar_number).first()
        if user is None:
            raise AuthenticationFailed('Registration ID is not Valid')

        serializer = PatientAccountSerializer(user)
        patientData=serializer.data
        mobile=patientData['mobile_no']
        email=patientData['email']
        name=patientData['patient_name']

        digits = [i for i in range(0, 10)]
        generate_otp = ""
        for i in range(5):
            index = math.floor(random.random() * 10)
            generate_otp += str(digits[index])

        client = vonage.Client(key=os.environ.get("VONGAGE_API_KEY"), secret=os.environ.get("VONGAGE_API_SECRET"))
        sms = vonage.Sms(client)
        responseData = sms.send_message(
            {
                "from": "JAM",
                "to": f"91{mobile}",
                "text": f"Hello {name}, Your OTP code is : {generate_otp}",
            }
        )

        if responseData["messages"][0]["status"] == "0":
            print("OTP sent successfully.")
            
            user.otp_code=generate_otp
            user.save()
            
            subject = "Your OTP to Login"
            msg = f"Hello {name}, Your OTP code is : {generate_otp}"
            to =email
            res = send_mail(subject, msg, settings.EMAIL_HOST_USER, [to])
            if res:
                print("Mail Send Successfully")
                
        else:
            print(
                f"Message failed with error: {responseData['messages'][0]['error-text']}")

        response = Response()
        response.data = {
            'message': 'OTP code was succesfully sent to your Email and Mobile, Check it!',
        }
        return response

class PatientLoginVerifyOTPView(APIView):
    def post(self, request):
        aadhar_number = request.data['aadhar_number']
        otp_code = request.data['otp_code']
        user = PatientAccount.objects.filter(aadhar_number=aadhar_number,otp_code=otp_code).first()

        response = Response()
        
        if user is None:
            response.data = {
                'result': 'Failed',
                'message':'Entered OTP is incorrect'
            }
        else:
            payload = {
                'user_id': user.aadhar_number,
                'exp': 24 * (datetime.today().timestamp()),
                'lat': datetime.today().timestamp()
            }

            token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

            response = Response(user)

            response.set_cookie(key='20mxJAM', value=token, httponly=True)

            response.data = {
                'result': 'Success',
                'message':'OTP verified Successfully',
                'user_id': user.aadhar_number,
                'hospital_id': user.account_created_hospital_id,
                'email': user.email,
                'interface': 'Patient',
                'token': token,
                "payload": payload
            }
        return response

class PatientAuthenticateView(APIView):
    def get(self, request):
        token = request.COOKIES.get('20mxJAM')
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        try:
            payload = jwt.decode(token, 'secret', algorithm=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')
        user = PatientAccount.objects.filter(aadhar_number=payload['user_id']).first()
        serializer = PatientAccountSerializer(user)
        return Response(serializer.data)

class PatientLogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('20mxJAM')
        response.data = {'message': 'success'}
        return response

""" class MobileVerifyView(APIView):
    def put(self, request, *args, **kwargs):
        digits = [i for i in range(0, 10)]
        generate_otp = ""
        for i in range(6):
            index = math.floor(random.random() * 10)
            generate_otp += str(digits[index])

        client = vonage.Client(key="", secret="")
        sms = vonage.Sms(client)
        responseData = sms.send_message(
            {
                "from": "JAM",
                "to": f"91{serializer.validated_data['mobile_no']}",
                "text": f"Hello {serializer.validated_data['patient_name']}, Your OTP code is : {generate_otp}",
            }
        )

        if responseData["messages"][0]["status"] == "0":
            print("Message sent successfully.")
        else:
            print(f"Message failed with error: {responseData['messages'][0]['error-text']}")

class EmailVerifyView(APIView):
     subject = "Verify Your Account"
        msg = f"Hello {serializer.validated_data['patient_name']}, Your OTP code is : {generate_otp}"
        to = serializer.validated_data['email']
        res = send_mail(subject, msg, settings.EMAIL_HOST_USER, [to])
         """

class PatientsPrescriptionView(CreateAPIView):
    def post(self, request):
        serializer = PatientsHistorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.save():
            return Response({
                "message": "Prescription Added successfully"
            })
        return Response(serializer.data)

class PatientsPrescriptionDataView(APIView):
    def get(self, request):
        aadhar_number = request.GET['aadhar_number']
        user = PatientsHistory.objects.filter(aadhar_number=aadhar_number).all()
        serializer = PatientsHistorySerializer(user, many=True)
        return JsonResponse(serializer.data, safe=False)
