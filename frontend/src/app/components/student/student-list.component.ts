import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentService } from '../../service/student/student.service';
import { FeedbackPopupComponent } from '../../shared/components/feedback-popup/feedback-popup.component';
import { PageComponent } from '../../shared/components/page/page.component';
import { Aluno } from '../../shared/interfaces/aluno.interface';
import { StudentFormDialogComponent } from './student-form-dialog/student-form-dialog.component';

@Component({
  selector: 'student-list',
  imports: [PageComponent, MatExpansionModule, MatIcon, CommonModule, MatTooltipModule, FeedbackPopupComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
})
export class StudentListComponent implements OnInit {
  studentsList: Aluno[] = [];
  readonly panelOpenState = signal(false);

  feedbackMessage = signal<string>('');
  feedbackType = signal<'success' | 'error' | ''>('');

  private readonly dialog = inject(MatDialog);
  private readonly studentsService = inject(StudentService);

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents(): void {
    this.studentsService.getAllStudents()
      .subscribe({
        next: (result: Aluno[]) => {
          this.studentsList = result;
        },
        error: (err) => {
          console.error('Erro ao buscar alunos', err);
          this.mostrarFeedback('Erro ao buscar alunos. Tente novamente.', 'error');
        }
      });
  }

  getInitials(fullName: string): string {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  addStudent(): void {
    this.dialog.open(StudentFormDialogComponent, { maxWidth: '800px', width: '100%' })
      .afterClosed().subscribe((result) => {
        if (result) {
          this.feedbackMessage.set('');
          this.feedbackType.set('');

          this.mostrarFeedback(result.message, result.type);
          this.getStudents();
        }
      });
  }

  editStudent(studentsItem: Aluno, event: MouseEvent): void {
    event.stopPropagation();

    this.dialog.open(StudentFormDialogComponent, { maxWidth: '800px', width: '100%', data: studentsItem })
      .afterClosed().subscribe((result) => {
        if (result) {
          this.mostrarFeedback(result.message, result.type);
          this.getStudents();
        }
      });
  }

  deleteStudent(studentsItem: Aluno, event: MouseEvent): void {
    event.stopPropagation();

    this.studentsService.deleteStudent(studentsItem.id)
      .subscribe({
        next: (res) => {
          this.mostrarFeedback(res.message, 'success');
          this.getStudents();
        },
        error: (err) => {
          console.error('Erro ao deletar aluno', err);
          this.mostrarFeedback('Erro ao deletar aluno. Tente novamente.', 'error');
        }
      });
  }

  listHasStudents(): boolean {
    return this.studentsList.every(cls => cls.filtered === true);
  }

  private mostrarFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage.set(message);
    this.feedbackType.set(type);
  }
}
