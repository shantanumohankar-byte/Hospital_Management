from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib import messages
from django.contrib.auth.decorators import login_required

# Create your views here.
def signup(request):
    # to check whether form has been submitted or not
    if request.method == 'POST':
        # fetching all the fields values from the form
        fn = request.POST.get('fn')
        ln = request.POST.get('ln')
        email = request.POST.get('email')
        un = request.POST.get('un')
        pw = request.POST.get('pw')

        # to check whether the email is unique
        if User.objects.filter(email = email).exists():
            messages.error(request, "Email already exists, kindly signup with a different email id..")
            return redirect('signup')

        
        if User.objects.filter(username = un).exists():
            messages.error(request, "Username is not available..")
            return redirect('signup')
        
        # creating a new user for ttthe web application using "create_user" function
        User.objects.create_user(first_name = fn, last_name = ln, email = email, username = un, password = pw)
        # displaying a msg saying "Registered Successfully!!"
        messages.success(request, "Registered Successfully!!")
        return redirect('signin')
    return render(request, 'signup.html')

def signin(request):
    if request.method == 'POST':
        un = request.POST.get('un')
        pw = request.POST.get('pw')
        # to check and return the details of user if the credentials are matching with the existing registered user details
        user = authenticate(request,
                     username = un,
                     password = pw)
        # if details are present, login
        # if details aree not present, do not login
        if user:
            # login the user into the current session
            login(request, user)
            # displaying a msg saying that "SIGN is successful"
            messages.success(request, "Successfully SIGNED IN...")
            return redirect('profile')
        else:
            # displaying a msg saying that "credentials does not match"
            messages.error(request, "Credentials does not match...")
    return render(request, 'signin.html')

@login_required(login_url='signin')
def profile(request):
    # current active user details will be available in current request's user details
    data = request.user
    return render(request, 'profile.html', {'data':data})

@login_required(login_url='signin')
def update_profile(request):
    # current user
    user = request.user
    if request.method == 'POST':
        fn = request.POST.get('fn')
        ln = request.POST.get('ln')
        email = request.POST.get('email')
        un = request.POST.get('un')

        # to check whether email is updated and is not as same as previous value
        if User.objects.filter(email = email).exists():
            messages.error(request, "Email cannot be same as previous Email ID...")
            return redirect('update_profile')
        # to check whether usernname is updated and is not same as previous value
        if User.objects.filter(username = un).exists():
            messages.error(request, "Username already exists, provide a new username..")
            return redirect('update_profile')

        # updation of user details
        user.first_name = fn
        user.last_name = ln
        user.email = email
        user.username = un
        user.save()

        messages.success(request, "Profile details aree updated successfully..")
        return render(request, 'profile.html', {'data':user})
    return render(request, 'update_profile.html', {'data':user})

@login_required(login_url='signin')
def update_password(request):
    # current user
    user = request.user
    if request.method == 'POST':
        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')

        # to check whether old password == existing password --> user.check_password(old_password)
        if not(user.check_password(old_password)):
            messages.error(request, "Old password is not matching..")
            return redirect('update_password')

        # to check whether the new password is not same as old password
        if new_password == old_password:
            messages.error(request, "New password should not be same as Old password..")
            return redirect('update_password')

        # to check wheth3er the new password is equal to confirm password
        if new_password != confirm_password:
            messages.error(request, "New password does not macth with the confirm password..")
            return redirect('update_password')

        # to encrypt the password and update --> set_password
        user.set_password(confirm_password)
        user.save()

        update_session_auth_hash(request, user)
        messages.success(request, "Password has been updated successfully!!")
        return render(request, 'profile.html', {'data':user})
    return render(request, 'update_password.html')

@login_required(login_url='signin')
def signout(request):
    # current user
    user = request.user
    if request.method == 'POST':
        logout(request)
        messages.success(request, "LOGGED out successfully!!")
        return redirect('signin')
    return render(request, 'signout.html')