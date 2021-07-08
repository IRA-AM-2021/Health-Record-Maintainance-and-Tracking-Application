from django.contrib import admin
from django.urls import path, include
from .views import PatientRegistrationView, PatientsListsView, PatientsView, PatientsDataView, PatientsPrescriptionView, PatientsPrescriptionDataView

urlpatterns = [
    path('account-create/', PatientRegistrationView.as_view()),
    path('lists/', PatientsListsView.as_view()),
    path('patients-lists/', PatientsView.as_view()),
    path('patients-data/', PatientsDataView.as_view()),
    path('patients-prescription/', PatientsPrescriptionView.as_view()),
    path('patients-prescription-history/', PatientsPrescriptionDataView.as_view()),
    
    # path('profile/', DoctorView.as_view()),
    # path('login/', LoginDoctorView.as_view()),
    # path('mail-verify/', MailVerifyView.as_view()),
    # path('token-verify/', TokenVerifyView.as_view()),
    # path('logout/', LogoutView.as_view()),
]
