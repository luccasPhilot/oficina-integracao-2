import { inject, Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
} from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async canActivate(
  ): Promise<boolean> {
    try {
      const isAuthenticated = await firstValueFrom(
        this.authService.isAuthenticated()
      );

      if (isAuthenticated) {
        return true;
      }

      this.router.navigate(['/login']);
      return false;
    } catch {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
