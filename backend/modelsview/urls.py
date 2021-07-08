from django.contrib import admin
from django.urls import path, include
# from django.conf import settings
# from django.conf.urls.static import static
# from . import views
from .views import HospitalRegistrationView, HospitalLoginView, HospitalDetailsView, UserView, LogoutView, DepartmentAddView, DepartmentView, HospitalAccountUpdateView, MailVerifyView
from rest_framework import routers
from django_email_verification import urls as email_urls

urlpatterns = [
    path('hospital-register/', HospitalRegistrationView.as_view()),
    path('hospital-login/', HospitalLoginView.as_view()),
    path('hospital-admin/', UserView.as_view()),
    path('hospital-logout/', LogoutView.as_view()),
    path('hospital-update/', HospitalAccountUpdateView.as_view()),
    path('hospital-dept/', DepartmentView.as_view()),
    path('hospital-dept-add/', DepartmentAddView.as_view()),
    path('hospital-details/',HospitalDetailsView.as_view()),
    path('email/', include(email_urls)),
    path('email-verify/', MailVerifyView.as_view()),
]
# +static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
