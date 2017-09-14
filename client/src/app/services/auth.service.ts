import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class AuthService {//exported to register.comp

  //this will provide the url for register route
  domain = "http://localhost:8080"; //8080 is our node api server, not the angular development server
  authToken;
  user;
  options;

  constructor(//http can be named whatever
    private http: Http
  ) { }
/////////////////logging in, accessing THIS user for profile info etc
  createAuthenticationHeaders(){
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    });
  }//this is used for any view or f(x) that will require the user authen

  loadToken(){
    const token = localStorage.getItem('token');
    this.authToken = token;// or just combbine these two lines into one
  }
/////////////  


  registerUser(user){//passing in user object, then sending it to API (express?)

    return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());//authentication route must be used for associated auth stuff
    //converting angular 2 user obj, into json mongo obj
  }


  //these two are defined in authentication.js, now have access to these in register component
  checkUsername(username){
  return this.http.get(this.domain + '/authentication/checkUsername/' + username).map(res => res.json());
  }

  checkEmail(email){
  return this.http.get(this.domain + '/authentication/checkEmail/' + email).map(res => res.json());
  }

  //login
  login(user){
    return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeUserData(token, user){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile(){//gonna run f(x) in profile component, createAuthHEaders above
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/profile', this.options).map(res => res.json());
  }

  loggedIn(){
    return tokenNotExpired();
  }

}
