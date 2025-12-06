import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../../service/auth/auth.service';
import { FeedbackPopupComponent } from '../feedback-popup/feedback-popup.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'page',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    CommonModule,
    FeedbackPopupComponent,
    MatFormFieldModule,
    MatInputModule,
    SearchBarComponent,
    MatTooltipModule
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css',
})
export class PageComponent {
  @Input() title: string = '';
  @Input() objectName: string = ''
  @Input() hasLateralScroll: boolean = false;
  @Input() showFilterButton: boolean = false;
  @Input() showAddButton: boolean = false;
  @Input() showSearchBar: boolean = false;
  @Input() dataSource: any = null;
  @Output() filterButtonClicked = new EventEmitter<void>();
  @Output() addButtonClicked = new EventEmitter<void>();
  @Output() dataSourceChange = new EventEmitter<any[]>();

  searchQuery!: string;
  feedbackMessage: string = '';
  feedbackType: 'success' | 'error' | '' = '';

  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  get currentRoute() {
    return this.router.url;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.http
      .post(`${environment.apiUrl}/auth/logout`, null, {
        withCredentials: true,
      })
      .pipe(finalize(() => { this.authService.logout() }))
      .subscribe({
        next: () => {
          this.mostrarFeedback('Logout realizado com sucesso!', 'success');
        },
        error: (err) => {
          this.mostrarFeedback(
            `Não foi possível invalidar a sessão no servidor, mas você foi desconectado localmente.`,
            'error'
          );
        },
      });
  }

  private mostrarFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
  }
}
