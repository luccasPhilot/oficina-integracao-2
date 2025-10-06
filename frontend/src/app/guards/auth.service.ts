import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient, private readonly router: Router) { }

  async isAuthenticated(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.http.get<{ isValid: boolean }>(`${this.apiUrl}/auth/validate-token`, { withCredentials: true }).subscribe({
        next: (response) => {
          resolve(response?.isValid ?? false);
        },
        error: () => {
          resolve(false);
        }
      });
    });
  }

  login(userData: any): Promise<{ message: string; type: 'success' | 'error' }> {
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/auth/login`, userData, { withCredentials: true })
        .subscribe({
          next: () => {
            resolve({ message: 'Login realizado com sucesso!', type: 'success' });
            this.router.navigate(['/adm-news']);
          },
          error: (err) => {
            const errorMessage =
              err.error?.message ??
              err.message ??
              'Erro desconhecido ao autenticar.';

            resolve({ message: `Erro ao autenticar: ${errorMessage}`, type: 'error' });
          },
        });
    });
  }

  logout(): void {
    console.log('Finalizando processo de logout...');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}