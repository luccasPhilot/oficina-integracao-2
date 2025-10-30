import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, take } from 'rxjs';
import { ENDPOINTS, EndpointsAuth } from '../../shared/interfaces/endpoints/endpoints-auth.interface';
import { environment } from '../../environments/environment';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public ENDPOINTS: EndpointsAuth = ENDPOINTS
  public URL: string = `${environment.apiUrl}/`

  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  public login(request: { user: string; password: string }): Observable<any> {
    return this.apiService.post(
      this.URL,
      this.ENDPOINTS.login,
      request,
      undefined,
      undefined,
      { withCredentials: true }
    ).pipe(take(1));
  }

  public logout(): void {
    console.log('Finalizando processo de logout...');
    this.apiService
      .post(this.URL, this.ENDPOINTS.logout, {}, undefined, undefined, { withCredentials: true })
      .pipe(take(1), catchError(() => of(null)))
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }

  public isAuthenticated(): Observable<boolean> {
    return this.apiService.get(
      this.URL,
      this.ENDPOINTS.validate,
      undefined,
      undefined,
      { withCredentials: true }
    ).pipe(
      take(1),
      map(response => response?.isValid ?? false),
      catchError(() => of(false))
    );
  }

}
