import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  //user;
  username;
  email;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {                             //profile var can be named whatever, like data
    this.authService.getProfile().subscribe(profile => {
      //this.user = profile.user;
      this.username = profile.user.username;
      this.email = profile.user.email;
    });
  }

}
