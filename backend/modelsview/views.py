from django.shortcuts import render
from rest_framework.serializers import Serializer
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import HospitalAccounts, Department
from .serializers import HospitalAccountSerializer, DepartmentsSerializer
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from django.http import HttpResponse,HttpRequest,JsonResponse
# from rest_framework.parsers import JSONParser, ParseError
# from rest_framework import generics
# from rest_framework.decorators import api_view
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime
from django.contrib.auth import get_user_model
from django_email_verification import send_email
import jwt
import json
import uuid

# Create your views here.
# def verifyMail():
#     try:
#         subject = "Your Email needs to be verified"
#         message = f'click the link to verify your email http://localhost:8000/{uuid.uuid4()}/'
#         email_from = settings.EMAIL_HOST_USER
#         recipient_list = [instance.email]
#         send_mail(subject, message, email_from, recipient_list)
#     except Exception as e:
#         print(e)

class HospitalRegistrationView(APIView):
    def post(self,request):
        serializer=HospitalAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class HospitalLoginView(APIView):
    def post(self,request):
        email=request.data['email']
        password=request.data['password']
        user=HospitalAccounts.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('Email is not Valid')

        if not user.check_password(password):
            raise AuthenticationFailed('Password is incorrect')

        # exp = json.dumps({'exp': datetime.datetime.utcnow()+datetime.timedelta(minutes=60)}, cls=DateTimeEncoder)
        # lat = json.dumps({'lat': datetime.datetime.utcnow()}, cls=DateTimeEncoder)

        payload={
            'user_id': user.user_id,
            'hospital_id': user.hospital_id,
            'exp': 24 * (datetime.today().timestamp()),
            'lat': datetime.today().timestamp()
        }
        
        token=jwt.encode(payload,'secret',algorithm='HS256').decode('utf-8')

        response=Response()
        response.set_cookie(key='20mxJAM',value=token,httponly=True)
      
        response.data={
            'message':'success',
            'user_id':user.user_id,
            'hospital_id':user.hospital_id,
            'email':email,
            'interface':'Hospital',
            'token':token,
            "payload":payload
        }
        return response
        # return render(request,)

class MailVerifyView(APIView):
    def post(self, request):
        email = request.data['email']
        emailVerify = request.data['is_email_Verified']
        user = HospitalAccounts.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed('Email is not Valid')

        if user.is_email_Verified == False:
            user.is_email_Verified = False
            send_email(user)

        response = Response()
        response.data = {
            'message': 'Verification Link was succesfully sent to your Email, Check it!',
        }
        return response

class UserView(APIView):
    def get(self,request):
        token=request.COOKIES.get('20mxJAM')
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        try:
            payload=jwt.decode(token,'secret',algorithm=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')
        user=HospitalAccounts.objects.filter(user_id=payload['user_id']).first()
        serializer=HospitalAccountSerializer(user)
        return Response(serializer.data)

class LogoutView(APIView):
    def post(self,request):
        response = Response()
        response.delete_cookie('20mxJAM')
        response.data={'message':'success'}
        return response        

class HospitalAccountUpdateView(APIView):
    queryset = HospitalAccounts.objects.all()
    serializer_class = HospitalAccounts

    def put(self, request, *args, **kwargs):
        token = request.COOKIES.get('20mxJAM')
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        try:
            payload=jwt.decode(token,'secret',algorithm=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')
            
        account = HospitalAccounts.objects.filter(user_id=payload['user_id']).first()
        data=request.data
        account.hospital_name = data["hospital_name"]
        account.hospital_id = data["hospital_id"]
        account.address= data["address"]
        account.branch = data["branch"]
        account.pincode = data["pincode"]
        account.mobile_no = data["mobile_no"]
        try :
            account.logo = data["logo"]
        except:
            pass
        account.save()
        serializer = HospitalAccountSerializer(account)
        return Response(serializer.data)

class DepartmentAddView(APIView):
    def post(self, request):
        serializer = DepartmentsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response = Response()
        response.data = {'message': 'success'}
        return response

class DepartmentView(APIView):
    def get(self, request):
        token = request.COOKIES.get('20mxJAM')
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        try:
            payload = jwt.decode(token, 'secret', algorithm=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')
        depts = Department.objects.filter(user_id=payload['user_id']).all()
        serializer = DepartmentsSerializer(depts, many=True)
        return JsonResponse(serializer.data, safe=False)

class HospitalDetailsView(APIView):
    def get(self, request):
        hospitalID = request.GET['hospital_id']
        user = HospitalAccounts.objects.filter(
            hospital_id=hospitalID).first()
        serializer =HospitalAccountSerializer(user)
        return Response(serializer.data)
        
class HospitalAccountView(viewsets.ModelViewSet):
    # queryset=HospitalAccounts.objects.all().order_by('-created_at')
    # queryset=HospitalAccounts.objects.all().filter()
    queryset=HospitalAccounts.objects.all()
    serializer_class=HospitalAccountSerializer
