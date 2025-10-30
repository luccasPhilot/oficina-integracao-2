import { inject, Injectable } from '@angular/core';
import {
    CanActivate,
    Router
} from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginRedirectGuard implements CanActivate {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    async canActivate(
    ): Promise<boolean> {
        try {
            const isAuthenticated = await firstValueFrom(
                this.authService.isAuthenticated()
            );

            if (isAuthenticated) {
                this.router.navigate(['/dashboard']);
                return false;
            }
            return true;
        } catch {
            return true;
        }
    }
}
