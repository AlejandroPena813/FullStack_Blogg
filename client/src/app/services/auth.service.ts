import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {//exported to register.comp

  //this will provide the url for register route
  domain = "http://localhost:8080"; //8080 is our node api server, not the angular development server
 
  constructor(//http can be named whatever
    private http: Http
  ) { }


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

}
