import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { SchoolService } from '../../service/school/school.service';
import { FeedbackPopupComponent } from '../../shared/components/feedback-popup/feedback-popup.component';
import { PageComponent } from '../../shared/components/page/page.component';
import { Escola } from '../../shared/interfaces/escola.interface';
import { SchoolFormDialogComponent } from './school-form-dialog/school-form-dialog.component';

@Component({
  selector: 'school-list',
  imports: [PageComponent, MatExpansionModule, MatIcon, CommonModule, MatTooltipModule, FeedbackPopupComponent],
  templateUrl: './school-list.component.html',
  styleUrl: './school-list.component.scss',
})
export class SchoolListComponent implements OnInit {
  schoolesList: Escola[] = [];
  schoolsList: Escola[] = [];

  readonly panelOpenState = signal(false);

  feedbackMessage = signal<string>('');
  feedbackType = signal<'success' | 'error' | ''>('');

  private readonly dialog = inject(MatDialog);
  private readonly schoolService = inject(SchoolService);

  ngOnInit(): void {
    this.getSchools();
  }

  getSchools(): void {
    this.schoolService.getAllSchools()
      .subscribe({
        next: (result: Escola[]) => {
          this.schoolsList = result;
        },
        error: (err) => {
          console.error('Erro ao buscar escolas', err);
          this.mostrarFeedback('Erro ao buscar escolas. Tente novamente.', 'error');
        }
      });
  }

  getInitials(fullName: string): string {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  addSchool(): void {
    this.dialog.open(SchoolFormDialogComponent, { maxWidth: '800px', width: '100%' })
      .afterClosed().subscribe((result) => {
        if (result) {
          this.feedbackMessage.set('');
          this.feedbackType.set('');

          this.mostrarFeedback(result.message, result.type);
          this.getSchools();
        }
      });
  }

  editSchool(schoolItem: Escola, event: MouseEvent): void {
    event.stopPropagation();

    this.dialog.open(SchoolFormDialogComponent, { maxWidth: '800px', width: '100%', data: schoolItem })
      .afterClosed().subscribe((result) => {
        if (result) {
          this.mostrarFeedback(result.message, result.type);
          this.getSchools();
        }
      });
  }

  deleteSchool(schoolItem: Escola, event: MouseEvent): void {
    event.stopPropagation();

    this.schoolService.deleteSchool(schoolItem.id)
      .subscribe({
        next: (res) => {
          this.mostrarFeedback(res.message, 'success');
          this.getSchools();
        },
        error: (err) => {
          console.error('Erro ao deletar Escola', err);
          this.mostrarFeedback('Erro ao deletar Escola. Tente novamente.', 'error');
        }
      });
  }

  listHasSchools(): boolean {
    return this.schoolsList.every(cls => cls.filtered === true);
  }

  private mostrarFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage.set(message);
    this.feedbackType.set(type);
  }
}
