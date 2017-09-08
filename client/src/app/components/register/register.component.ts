import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';//pulling in service, implemented at bottom
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;//exporting formgroup
  ////////////////////////////
  message;//for registration results message, uses in service below
  messageClass;
  processing = false;//purpose is to lock down reg fields while submitting a req, to avoid server overload
  
  emailValid;//next 4 variables used in checkEmail, so user can see errors while typing in registration
  emailMessage;
  usernameValid;
  usernameMessage;

  /////////////////////

    constructor(//can be named what you want, but has to be of type imported above
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) { 

      this.createForm()

    }

  createForm(){
    this.form = this.formBuilder.group({//here we define fields of our form group
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30), //match those in authentication.js/users.js
        this.validateEmail//custom validator, written below, DOESNT INCLUDE PARAMTER CONTROL
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15), //match those in authentication.js/users.js
        this.validateUsername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35), //match those in authentication.js/users.js
        this.validatePassword
      ])],
      confirm: ['', Validators.required]
    }, {validator: this.matchingPasswords('password', 'confirm') }); //this object added to overall formgroup, rather than each field. accesss to 2 attr
  }

  disableForm(){//disables form when req is being submitted, to be called by form submit functin below
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  enableForm(){
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

//will be called in createForm above, WITHOUT PARAMETER CONTROL
  validateEmail(controls){//controls is part of form group
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateEmail': true}//error, same name as func for simplicity
    }
  }

validateUsername(controls){
            
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateUsername': true}//error, same name as func for simplicity
    }
}

validatePassword(controls){
  
  const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
  if(regExp.test(controls.value)){
    return null;
  } else{
    return{'validatePassword': true}
  }
}

matchingPasswords(password, confirm){ //RESEARCH THIS
  return (group: FormGroup) => {
    if(group.controls[password].value === group.controls[confirm].value){
      return null;
    } else{
      return {'matchingPasswords': true} //here, 30'
    }
  }
}

  onRegisterSubmit(){ //this is called by html submit() func
    //form is what i created above

    this.processing = true;
    this.disableForm();

    const user ={
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.authService.registerUser(user).subscribe(data => {//using service created to submit
      if(!data.success){
        this.messageClass = 'alert alert-danger';//sets values for registration message in reg.comp.html
        this.message = data.message;//data.message is value passed from express api/authentication.js
        this.processing = false;
        this.enableForm();
      } else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000)
      }
    }); //currently using angular dev server, but this req 

    //console.log(this.form.get('email').value); testing 
  }
/////////////////////////////
  //these f(x) provide error message as user types, rather than waiting to submit for errrors
  checkEmail(){
    this.authService.checkEmail(this.form.get('email').value).subscribe(data =>{
      if(!data.success){
        this.emailValid = false;
        this.emailMessage = data.message;
      } else{
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    });
  }

  checkUsername(){
    this.authService.checkUsername(this.form.get('username').value).subscribe(data =>{
      if(!data.success){
        this.usernameValid = false;
        this.usernameMessage = data.message;
      } else{
        this.usernameValid = true;
        this.usernameMessage = data.message;
      }
    });
  }
/////////////////////////
  ngOnInit() {
  }

}
