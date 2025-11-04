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
import { SchoolService } from '../../../service/school/school.service';
import { FeedbackPopupComponent } from "../../../shared/components/feedback-popup/feedback-popup.component";
import { Escola } from '../../../shared/interfaces/escola.interface';
import { Turma } from '../../../shared/interfaces/turma.interface';
import { SchoolFormDialogComponent } from '../../school/school-form-dialog/school-form-dialog.component';

@Component({
  selector: 'class-form-dialog',
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
  templateUrl: './class-form-dialog.component.html',
  styleUrl: './class-form-dialog.component.scss',
})
export class ClassFormDialogComponent implements OnInit {
  classForm: FormGroup;
  schoolsList: Escola[] = [];

  feedbackMessage = signal<string>('');
  feedbackType = signal<'success' | 'error' | ''>('');

  private readonly fb = inject(FormBuilder);
  private readonly classService = inject(ClassService);
  private readonly schoolService = inject(SchoolService);
  private readonly dialog = inject(MatDialog);
  public dialogRef = inject(MatDialogRef<ClassFormDialogComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Turma
  ) {
    this.classForm = this.fb.group({
      identificacao: ['', Validators.required],
      escola_id: ['', Validators.required],
    });

    if (this.data) {
      this.classForm.patchValue({
        identificacao: this.data.identificacao,
        escola_id: this.data.escola_id
      });
    }
  }

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

  addSchool(): void {
    this.dialog.open(SchoolFormDialogComponent, { maxWidth: '800px', width: '100%' })
      .afterClosed().subscribe((result) => {
        if (result) {
          this.classForm.patchValue({
            escola_id: result.id
          });

          this.mostrarFeedback(result.message, result.type);
          this.getSchools();
        }
      });
  }

  onSubmit(): void {
    if (this.classForm.invalid) {
      this.classForm.markAllAsTouched();
      return;
    }

    this.feedbackMessage.set('');
    this.feedbackType.set('');

    const formData = this.classForm.value;

    const request = this.data
      ? this.classService.updateClass(this.data.id, formData)
      : this.classService.addClass(formData);

    request.subscribe({
      next: (res) => {
        const message = res.message || (this.data ? 'Turma atualizada com sucesso!' : 'Turma criada com sucesso!');
        const type = res.type || 'success';
        this.dialogRef.close({ id: res.id, message, type });
      },
      error: (err) => {
        console.error('Erro ao salvar turma', err);
        const message = err.error?.message || 'Erro ao salvar turma. Tente novamente.';
        this.mostrarFeedback(message, 'error');
      }
    });
  }

  private mostrarFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage.set(message);
    this.feedbackType.set(type);
  }
}