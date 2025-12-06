import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ClassService } from '../../../service/class/class.service';
import { StudentService } from '../../../service/student/student.service';
import { FeedbackPopupComponent } from '../../../shared/components/feedback-popup/feedback-popup.component';
import { Aluno } from '../../../shared/interfaces/aluno.interface';
import { Turma } from '../../../shared/interfaces/turma.interface';
import { ClassFormDialogComponent } from '../../class/class-form-dialog/class-form-dialog.component';

@Component({
  selector: 'student-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    FeedbackPopupComponent
  ],
  templateUrl: './student-form-dialog.component.html',
  styleUrl: './student-form-dialog.component.scss',
})
export class StudentFormDialogComponent implements OnInit {
  studentForm: FormGroup;
  classesList: Turma[] = [];

  feedbackMessage = signal<string>('');
  feedbackType = signal<'success' | 'error' | ''>('');

  private readonly fb = inject(FormBuilder);
  private readonly studentService = inject(StudentService);
  private readonly classService = inject(ClassService);
  private readonly dialog = inject(MatDialog);
  public dialogRef = inject(MatDialogRef<StudentFormDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Aluno) {
    this.studentForm = this.fb.group({
      nome: ['', Validators.required],
      idade: [null, [Validators.min(1), Validators.max(120)]],
      turma_id: ['', Validators.required],
    });

    if (this.data) {
      this.studentForm.patchValue({
        nome: this.data.nome,
        idade: this.data.idade,
        turma_id: this.data.turma_id,
      });
    }
  }

  ngOnInit(): void {
    this.getClasses();
  }

  getClasses(): void {
    this.classService.getAllClasses().subscribe({
      next: (result: Turma[]) => {
        this.classesList = result;
      },
      error: (err) => {
        this.mostrarFeedback('Erro ao buscar turmas. Tente novamente.', 'error');
      },
    });
  }

  addClass(): void {
    this.dialog.open(ClassFormDialogComponent, { maxWidth: '800px', width: '100%' })
      .afterClosed().subscribe((result) => {
        if (result) {
          this.studentForm.patchValue({
            turma_id: result.id
          });

          this.mostrarFeedback(result.message, result.type);
          this.getClasses();
        }
      });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.feedbackMessage.set('');
    this.feedbackType.set('');

    const formData = this.studentForm.value;

    const request = this.data
      ? this.studentService.updateStudent(this.data.id, formData)
      : this.studentService.addStudent(formData);
    request.subscribe({
      next: (res) => {
        const message = res.message || (this.data ? 'Aluno atualizado com sucesso!' : 'Aluno criado com sucesso!');
        const type = res.type || 'success';
        this.dialogRef.close({ message, type });
      },
      error: (err) => {
        const message = err.error?.message || 'Erro ao salvar aluno. Tente novamente.';
        this.mostrarFeedback(message, 'error');
      },
    });
  }

  private mostrarFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage.set(message);
    this.feedbackType.set(type);
  }
}
