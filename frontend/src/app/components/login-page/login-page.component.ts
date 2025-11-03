import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';
import { FeedbackPopupComponent } from '../../shared/components/feedback-popup/feedback-popup.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FeedbackPopupComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  feedbackMessage = signal<string>('');
  feedbackType = signal<'success' | 'error' | ''>('');
  isLoading = signal<boolean>(false);

  loginForm = this.fb.group({
    id: ['', [Validators.required, Validators.maxLength(30)]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.feedbackMessage.set('');
    this.feedbackType.set('');

    this.authService.login({
      user: this.loginForm.get('id')?.value || '',
      password: this.loginForm.get('password')?.value || '',
    })
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          const message = res.message || 'Login bem-sucedido!';
          const type = res.type || 'success';
          this.mostrarFeedback(message, type);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Falha no login', err);
          const message = err.error?.message || 'Erro ao tentar login. Tente novamente.';
          this.mostrarFeedback(message, 'error');
        }
      });
  }

  private mostrarFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage.set(message);
    this.feedbackType.set(type);
  }
}
