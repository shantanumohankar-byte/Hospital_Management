from django.urls import path
from . import views

urlpatterns = [

    # Doctors API
    path('doctors/',        views.doctors_list_create,      name='api_doctors'),
    path('doctors/<int:pk>/', views.doctors_update_delete,  name='api_doctor_detail'),

    # Patients API
    path('patients/',         views.patients_list_create,     name='api_patients'),
    path('patients/<int:pk>/', views.patients_update_delete,  name='api_patient_detail'),

    # Appointments API
    path('appointments/',         views.appointments_list_create,     name='api_appointments'),
    path('appointments/<int:pk>/', views.appointments_update_delete,  name='api_appointment_detail'),

]
