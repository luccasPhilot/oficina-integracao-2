import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { RepresentativeService } from '../../service/representative/representative.service';
import { FeedbackPopupComponent } from '../../shared/components/feedback-popup/feedback-popup.component';
import { PageComponent } from '../../shared/components/page/page.component';
import { Representante } from '../../shared/interfaces/representante.interface';
import { RepresentativeFormDialogComponent } from './representative-form-dialog/representative-form-dialog.component';

@Component({
  selector: 'representative-list',
  imports: [PageComponent, MatExpansionModule, MatIcon, CommonModule, MatTooltipModule, FeedbackPopupComponent],
  templateUrl: './representative-list.component.html',
  styleUrl: './representative-list.component.scss',
})
export class RepresentativeListComponent implements OnInit {
  representativesList: Representante[] = [];

  readonly panelOpenState = signal(false);

  feedbackMessage = signal<string>('');
  feedbackType = signal<'success' | 'error' | ''>('');

  private readonly dialog = inject(MatDialog);
  private readonly representativesService = inject(RepresentativeService);

  ngOnInit(): void {
    this.getRepresentatives();
  }

  getRepresentatives(): void {
    this.representativesService.getAllRepresentatives()
      .subscribe({
        next: (result: Representante[]) => {
          this.representativesList = result;
        },
        error: (err) => {
          this.mostrarFeedback('Erro ao buscar representantes. Tente novamente.', 'error');
        }
      });
  }

  getInitials(fullName: string): string {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  addRepresentative(): void {
    this.dialog.open(RepresentativeFormDialogComponent, { maxWidth: '800px', width: '100%' })
      .afterClosed().subscribe((result) => {
        if (result) {
          this.feedbackMessage.set('');
          this.feedbackType.set('');

          this.mostrarFeedback(result.message, result.type);
          this.getRepresentatives();
        }
      });
  }

  editRepresentative(representativesItem: Representante, event: MouseEvent): void {
    event.stopPropagation();

    this.dialog.open(RepresentativeFormDialogComponent, { maxWidth: '800px', width: '100%', data: representativesItem })
      .afterClosed().subscribe((result) => {
        if (result) {
          this.mostrarFeedback(result.message, result.type);
          this.getRepresentatives();
        }
      });
  }

  deleteRepresentative(representativesItem: Representante, event: MouseEvent): void {
    event.stopPropagation();

    this.representativesService.deleteRepresentative(representativesItem.id)
      .subscribe({
        next: (res) => {
          this.mostrarFeedback(res.message, 'success');
          this.getRepresentatives();
        },
        error: (err) => {
          this.mostrarFeedback('Erro ao deletar representante. Tente novamente.', 'error');
        }
      });
  }

  listHasRepresentatives(): boolean {
    return this.representativesList.every(cls => cls.filtered === true);
  }

  private mostrarFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage.set(message);
    this.feedbackType.set(type);
  }
}
