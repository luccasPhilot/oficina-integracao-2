import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class LoginRedirectGuard implements CanActivate {
    constructor(private readonly authService: AuthService, private readonly router: Router) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (await this.authService.isAuthenticated()) {
            this.router.navigate(['/adm-news']);
            return false;
        }

        return true;
    }
}