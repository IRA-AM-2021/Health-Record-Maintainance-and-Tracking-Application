from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from rest_framework.serializers import Serializer
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import DoctorAccount
from .serializers import DoctorAccountSerializer, CheckDoctorAccountAvailableSerializer
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
# from django_email_verification import send_email
from django.core.mail import send_mail
import jwt
import json
import uuid

# Create your views here.

class DoctorRegistrationView(CreateAPIView):
    def post(self, request):
        serializer = DoctorAccountSerializer(data=request.data)  
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class DoctorListsView(APIView):
    def get(self, request):
        hospital_id = request.GET['hospital_id']
        user = DoctorAccount.objects.filter(hospital_id=hospital_id).all()
        serializer = DoctorAccountSerializer(user, many=True)
        return JsonResponse(serializer.data, safe=False)

class LoginDoctorView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user = DoctorAccount.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('Email is not Valid')

        if DoctorAccount.objects.filter(email=email, password='').first():
            checkPaswd = DoctorAccount.objects.filter(email=email, password_before_verification=password).first()
            if checkPaswd is None:
                raise AuthenticationFailed('Password is incorrect')
        else:
            if not user.check_password(password):
                raise AuthenticationFailed('Password is incorrect')            

        payload = {
            'user_id': user.app_id,
            'exp': 24 * (datetime.today().timestamp()),
            'lat': datetime.today().timestamp()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

        response = Response(user)
        response.set_cookie(key='20mxJAM', value=token, httponly=True)

        response.data = {
            'message': 'success',
            'user_id': user.app_id,
            'hospital_id': user.hospital_id,
            'email': email,
            'interface': 'Doctor',
            'token': token,
            "payload": payload
        }

        return response

class DoctorView(APIView):
    def get(self, request):
        token = request.COOKIES.get('20mxJAM')
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        try:
            payload = jwt.decode(token, 'secret', algorithm=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')
        doctor=DoctorAccount.objects.filter(app_id=payload['user_id']).first()
        serializer = CheckDoctorAccountAvailableSerializer(doctor)
        return Response(serializer.data)

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('20mxJAM')
        response.data = {'message': 'success'}
        return response

class MailVerifyView(APIView):
    def post(self, request):
        email = request.data['email']
        emailVerify = request.data['email_Verified']
        doctor = DoctorAccount.objects.filter(email=email).first()
        if doctor is None:
            raise AuthenticationFailed('Email is not Valid')

        if doctor.email_Verified == False:
            doctor.email_Verified = False
            # send_email(doctor)
            payload = {
                'user_id': doctor.app_id,
                'exp': 24 * (datetime.today().timestamp()),
                'lat': datetime.today().timestamp()
            }

            token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

            account = DoctorAccount.objects.filter(email=email).first()
            account.verify_token = token
            account.save()

            subject = "Verify Your Email"
            msg=f"\t \t \t Welcome Doctor { account.name } \n Click the below link to verify your email. \n"
            msg += f"http://localhost:3000/verify-token/?email={email}&token={token}"
            to = email
            res = send_mail(subject, msg, settings.EMAIL_HOST_USER, [to])

        response = Response()
        response.data = {
            'message': 'Verification Link was succesfully sent to your Email, Check it!',
        }
        return response

class TokenVerifyView(APIView):
    def post(self, request):
        email = request.data['email']
        token= request.data['verify_token']

        message=""

        if DoctorAccount.objects.filter(email=email,verify_token=token).first():
           message="success"
           account = DoctorAccount.objects.filter(email=email).first()
           account.verify_token = ''
           account.email_Verified=True
           account.save()
    
        response = Response()
        response.data = {
            'message': "success",
        }
        return response

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('20mxJAM')
        response.data = {'message': 'success'}
        return response
