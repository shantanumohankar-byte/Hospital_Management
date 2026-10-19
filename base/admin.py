from django.contrib import admin

# Register your models here.
from .models import Doctors,Patients,Appointments
admin.site.register(Doctors)
admin.site.register(Patients)
admin.site.register(Appointments)