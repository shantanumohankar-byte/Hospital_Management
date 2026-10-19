from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Doctors(models.Model):
    dname = models.CharField(max_length=30)
    dphno = models.IntegerField()
    demail = models.EmailField()
    dspec = models.CharField(max_length=100)
    davail = models.BooleanField()
    dpassword = models.CharField(max_length=128, default=None, null=True, blank=True)
    # upload_to --> to let know the control where the uploaded files has to be stored
    # null --> it is to let know the models that the field can accept null values
    # blank --> to leabe the input fields of forms as empty or balnk
    doc_pic = models.ImageField(upload_to='images', null=True, blank=True )
    doc_intro = models.FileField(upload_to='videos', null=True, blank=True)
    # to refer twhether the record is deleted or not
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.dname

class Patients(models.Model):
    pname = models.CharField(max_length=100)
    pphno = models.IntegerField()
    pemail = models.EmailField()
    page = models.IntegerField()
    pat_pic = models.ImageField(upload_to='images', null=True, blank=True)
    pat_symp = models.FileField(upload_to='audio', null=True, blank=True)

    def __str__(self):
        return self.pname

class Appointments(models.Model):
    doctor = models.ForeignKey(Doctors, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE)
    appoint_date = models.DateField()
    appoint_time = models.TimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, null=True, blank=True)
    document = models.FileField(upload_to='documents', null=True, blank=True)


# pip install pillow --> it is used to validate the images uploaded to the application, if any other file formats are being uploaded, it will not accept them.