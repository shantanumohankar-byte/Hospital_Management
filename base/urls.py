from django.urls import path
from . import views

urlpatterns = [
    path('create_patients', views.create_patients, name = 'create_pat'),
    path('display_patients', views.display_patients, name = 'display_pat'),
    path('update_patients/<int:pid>', views.update_patients, name= 'update_pat'),
    path('delete_patients/<int:pid>', views.delete_patients, name = 'delete_pat'),


    
    path('', views.create, name = 'create'),
    path('read', views.read, name = 'read'),
    path('update/<int:did>', views.update, name = 'update'),
    path('delete/<int:did>', views.delete, name = 'delete'),
    path('doc_history',views.doc_history,name="doc_history"),
    path('doc_restore/<int:did>',views.doc_restore,name="doc_restore"),


    path('create_appoint', views.create_appoint, name = 'create_appoint'),
    path('display_appoint', views.display_appoint, name = 'display_appoint'),
    path('update_appoint/<int:aid>', views.update_appoint, name = 'update_appoint'),
    path('delete_appoint<int:aid>', views.delete_appoint, name = 'delete_appoint')
]