import {Injectable} from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthService } from '../services/auth.service'; //fix this

@Injectable()
export class NotAuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ){}

    canActivate(){

        if(this.authService.loggedIn()) {
            this.router.navigate(['/']);//to home pg
            return false;
        } else{
            return true;
        }

    }
}