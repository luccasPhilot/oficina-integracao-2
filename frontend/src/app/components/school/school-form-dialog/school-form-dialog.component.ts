import { CommonModule } from '@angular/common';
import { Component, inject, Inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SchoolService } from '../../../service/school/school.service';
import { FeedbackPopupComponent } from "../../../shared/components/feedback-popup/feedback-popup.component";
import { Escola } from '../../../shared/interfaces/escola.interface';

@Component({
  selector: 'school-form-dialog',
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
  templateUrl: './school-form-dialog.component.html',
  styleUrl: './school-form-dialog.component.scss',
})
export class SchoolFormDialogComponent {
  schoolForm: FormGroup;
  schoolsList: Escola[] = [];
  estados: string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  feedbackMessage = signal<string>('');
  feedbackType = signal<'success' | 'error' | ''>('');

  private readonly fb = inject(FormBuilder);
  private readonly schoolService = inject(SchoolService);
  public dialogRef = inject(MatDialogRef<SchoolFormDialogComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Escola
  ) {
    this.schoolForm = this.fb.group({
      nome: ['', Validators.required],
      endereco: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', Validators.required],
    });

    if (this.data) {
      this.schoolForm.patchValue({
        nome: this.data.nome,
        endereco: this.data.endereco,
        cidade: this.data.cidade,
        estado: this.data.estado,
        telefone: this.data.telefone,
        email: this.data.email,
      });
    }
  }

  onSubmit(): void {
    if (this.schoolForm.invalid) {
      this.schoolForm.markAllAsTouched();
      return;
    }

    this.feedbackMessage.set('');
    this.feedbackType.set('');

    const formData = this.schoolForm.value;

    const request = this.data
      ? this.schoolService.updateSchool(this.data.id, formData)
      : this.schoolService.addSchool(formData);

    request.subscribe({
      next: (res) => {
        const message = res.message || (this.data ? 'Escola atualizada com sucesso!' : 'Escola criada com sucesso!');
        const type = res.type || 'success';
        this.dialogRef.close({ id: res.id, message, type });
      },
      error: (err) => {
        console.error('Erro ao salvar Escola', err);
        const message = err.error?.message || 'Erro ao salvar Escola. Tente novamente.';
        this.mostrarFeedback(message, 'error');
      }
    });
  }

  private mostrarFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage.set(message);
    this.feedbackType.set(type);
  }
}