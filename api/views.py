from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from base.models import Doctors, Patients, Appointments
from .serializer import DoctorsSerializer, PatientsSerializer, AppointmentsSerializer


# ─── DOCTORS ──────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
def doctors_list_create(request):
    """
    GET  /api/doctors/     → returns all doctors as JSON
    POST /api/doctors/     → creates a new doctor from JSON body
    """
    if request.method == 'GET':
        data = Doctors.objects.filter(is_deleted=False)
        serializer = DoctorsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = DoctorsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def doctors_update_delete(request, pk):
    """
    GET    /api/doctors/<id>/  → returns single doctor
    PUT    /api/doctors/<id>/  → updates doctor
    DELETE /api/doctors/<id>/  → deletes doctor
    """
    try:
        doctor = Doctors.objects.get(pk=pk)
    except Doctors.DoesNotExist:
        return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DoctorsSerializer(doctor)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = DoctorsSerializer(doctor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        doctor.delete()
        return Response({'message': 'Doctor deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


# ─── PATIENTS ─────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
def patients_list_create(request):
    """
    GET  /api/patients/  → returns all patients as JSON
    POST /api/patients/  → creates a new patient from JSON body
    """
    if request.method == 'GET':
        data = Patients.objects.all()
        serializer = PatientsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = PatientsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def patients_update_delete(request, pk):
    """
    GET    /api/patients/<id>/  → returns single patient
    PUT    /api/patients/<id>/  → updates patient
    DELETE /api/patients/<id>/  → deletes patient
    """
    try:
        patient = Patients.objects.get(pk=pk)
    except Patients.DoesNotExist:
        return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PatientsSerializer(patient)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = PatientsSerializer(patient, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        patient.delete()
        return Response({'message': 'Patient deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


# ─── APPOINTMENTS ─────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
def appointments_list_create(request):
    """
    GET  /api/appointments/  → returns all appointments as JSON
    POST /api/appointments/  → creates a new appointment from JSON body
    """
    if request.method == 'GET':
        data = Appointments.objects.all()
        serializer = AppointmentsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = AppointmentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def appointments_update_delete(request, pk):
    """
    GET    /api/appointments/<id>/  → returns single appointment
    PUT    /api/appointments/<id>/  → updates appointment
    DELETE /api/appointments/<id>/  → deletes appointment
    """
    try:
        appointment = Appointments.objects.get(pk=pk)
    except Appointments.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AppointmentsSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = AppointmentsSerializer(appointment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        appointment.delete()
        return Response({'message': 'Appointment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
