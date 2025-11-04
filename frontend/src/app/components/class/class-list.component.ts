import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClassService } from '../../service/class/class.service';
import { FeedbackPopupComponent } from '../../shared/components/feedback-popup/feedback-popup.component';
import { PageComponent } from '../../shared/components/page/page.component';
import { Aluno } from '../../shared/interfaces/aluno.interface';
import { Escola } from '../../shared/interfaces/escola.interface';
import { Turma } from '../../shared/interfaces/turma.interface';
import { ClassFormDialogComponent } from './class-form-dialog/class-form-dialog.component';

@Component({
  selector: 'class-list',
  imports: [PageComponent, MatExpansionModule, MatIcon, CommonModule, MatTooltipModule, FeedbackPopupComponent],
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.scss',
})
export class ClassListComponent implements OnInit {
  classesList: Turma[] = [];
  schoolsList: Escola[] = [];

  readonly panelOpenState = signal(false);

  feedbackMessage = signal<string>('');
  feedbackType = signal<'success' | 'error' | ''>('');

  private readonly dialog = inject(MatDialog);
  private readonly classService = inject(ClassService);

  ngOnInit(): void {
    this.getClasses();
  }

  getClasses(): void {
    this.classService.getAllClasses()
      .subscribe({
        next: (result: any[]) => {
          this.classesList = result.map((item): Turma => ({
            id: String(item.id),
            identificacao: String(item.identificacao),
            escola: item.Escola as Escola || item.escola as Escola || {} as Escola,
            alunos: (item.Alunos as Aluno[] || item.alunos as Aluno[] || []),
            escola_id: String(item.escola_id),
            createdAt: new Date(item.createdAt).toISOString(),
          }));
        },
        error: (err) => {
          console.error('Erro ao buscar turmas', err);
          this.mostrarFeedback('Erro ao buscar turmas. Tente novamente.', 'error');
        }
      });
  }

  getInitials(fullName: string): string {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  addClass(): void {
    this.dialog.open(ClassFormDialogComponent, { width: '560px' })
      .afterClosed().subscribe((result) => {
        if (result) {
          this.feedbackMessage.set('');
          this.feedbackType.set('');

          this.mostrarFeedback(result.message, result.type);
          this.getClasses();
        }
      });
  }

  editClass(classItem: Turma, event: MouseEvent): void {
    event.stopPropagation();

    this.dialog.open(ClassFormDialogComponent, { width: '560px', data: classItem })
      .afterClosed().subscribe((result) => {
        if (result) {
          this.mostrarFeedback(result.message, result.type);
          this.getClasses();
        }
      });
  }

  deleteClass(classItem: Turma, event: MouseEvent): void {
    event.stopPropagation();

    this.classService.deleteClass(classItem.id)
      .subscribe({
        next: (res) => {
          this.mostrarFeedback(res.message, 'success');
          this.getClasses();
        },
        error: (err) => {
          console.error('Erro ao deletar turma', err);
          this.mostrarFeedback('Erro ao deletar turma. Tente novamente.', 'error');
        }
      });
  }

  editStudent(): void {
    //To do
  }

  deleteStudent(): void {
    //To do
  }

  listHasClasses(): boolean {
    return this.classesList.every(cls => cls.filtered === true);
  }

  private mostrarFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage.set(message);
    this.feedbackType.set(type);
  }
}
