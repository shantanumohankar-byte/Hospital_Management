from django import forms
from .models import Doctors, Patients, Appointments

class DoctorsModelForm(forms.ModelForm):
    dpassword = forms.CharField(widget = forms.PasswordInput())
    class Meta:
        model = Doctors
        fields = ["dname", "dphno", "demail", "dspec", "davail", "dpassword", "doc_pic", "doc_intro"]

class PatientsModelForm(forms.ModelForm):
    class Meta:
        model = Patients
        fields = ["pname", "pphno", "pemail", "page", "pat_pic", "pat_symp"]

class AppointmentsModelForm(forms.ModelForm):
    class Meta:
        model = Appointments
        fields = ["doctor", "patient", "appoint_date", "appoint_time", "user", "document"]
   