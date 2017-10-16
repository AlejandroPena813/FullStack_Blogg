import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';//know if user logged in or not

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

}
