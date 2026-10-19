from django.urls import path
from . import views

urlpatterns = [
    path('', views.signin, name = 'signin'),
    path('signup', views.signup, name = 'signup'),
    path('profile', views.profile, name = 'profile'),
    path('signout', views.signout, name = 'signout'),
    path('update_profile', views.update_profile, name = 'update_profile'),
    path('update_password', views.update_password, name = 'update_password'),
]

