from rest_framework import serializers
from base.models import Doctors, Patients, Appointments


class DoctorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctors
        # excluding is_deleted so it doesn't show in API response
        fields = ['id', 'dname', 'dphno', 'demail', 'dspec', 'davail']


class PatientsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patients
        fields = ['id', 'pname', 'pphno', 'pemail', 'page']


class AppointmentsSerializer(serializers.ModelSerializer):
    # shows doctor name and patient name instead of just IDs
    doctor_name  = serializers.CharField(source='doctor.dname',  read_only=True)
    patient_name = serializers.CharField(source='patient.pname', read_only=True)

    class Meta:
        model = Appointments
        fields = ['id', 'doctor', 'doctor_name', 'patient', 'patient_name',
                  'appoint_date', 'appoint_time']
