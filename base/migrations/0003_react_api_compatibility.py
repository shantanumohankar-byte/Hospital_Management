from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('base', '0002_doctors_is_deleted'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctors', name='dspec',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='doctors', name='dpassword',
            field=models.CharField(blank=True, default=None, max_length=128, null=True),
        ),
        migrations.AlterField(
            model_name='patients', name='pname',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='appointments', name='user',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
