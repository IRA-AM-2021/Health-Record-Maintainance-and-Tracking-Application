from django.contrib import admin
from django.urls import path, include
from .views import DoctorRegistrationView, DoctorView, DoctorsListView, DoctorListsView, LoginDoctorView, MailVerifyView, TokenVerifyView, LogoutView
from django_email_verification import urls as email_urls

urlpatterns = [
    path('account-create/', DoctorRegistrationView.as_view()),
    path('lists/', DoctorListsView.as_view()),
    path('profile/', DoctorView.as_view()),
    path('login/', LoginDoctorView.as_view()),
    path('doctors-lists/', DoctorsListView.as_view()),
    path('mail-verify/', MailVerifyView.as_view()),
    path('token-verify/', TokenVerifyView.as_view()),
    path('logout/', LogoutView.as_view()),
]
