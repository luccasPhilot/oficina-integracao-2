import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RepresentativeService } from '../../../service/representative/representative.service';
import { SchoolService } from '../../../service/school/school.service';
import { FeedbackPopupComponent } from '../../../shared/components/feedback-popup/feedback-popup.component';
import { Escola } from '../../../shared/interfaces/escola.interface';
import { Representante } from '../../../shared/interfaces/representante.interface';
import { SchoolFormDialogComponent } from '../../school/school-form-dialog/school-form-dialog.component';

@Component({
  selector: 'representative-form-dialog',
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
  templateUrl: './representative-form-dialog.component.html',
  styleUrl: './representative-form-dialog.component.scss',
})
export class RepresentativeFormDialogComponent implements OnInit {
  representativeForm: FormGroup;
  schoolsList: Escola[] = [];

  feedbackMessage = signal<string>('');
  feedbackType = signal<'success' | 'error' | ''>('');

  private readonly fb = inject(FormBuilder);
  private readonly representativeService = inject(RepresentativeService);
  private readonly schoolService = inject(SchoolService);
  private readonly dialog = inject(MatDialog);
  public dialogRef = inject(MatDialogRef<RepresentativeFormDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Representante) {
    this.representativeForm = this.fb.group({
      nome: ['', Validators.required],
      cargo: [''],
      telefone: [''],
      escola_id: ['', Validators.required],
    });

    if (this.data) {
      this.representativeForm.patchValue({
        nome: this.data.nome,
        cargo: this.data.cargo,
        telefone: this.data.telefone,
        escola_id: this.data.escola_id,
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
          this.representativeForm.patchValue({
            escola_id: result.id
          });

          this.mostrarFeedback(result.message, result.type);
          this.getSchools();
        }
      });
  }

  onSubmit(): void {
    if (this.representativeForm.invalid) {
      this.representativeForm.markAllAsTouched();
      return;
    }

    this.feedbackMessage.set('');
    this.feedbackType.set('');

    const formData = this.representativeForm.value;

    const request = this.data
      ? this.representativeService.updateRepresentative(this.data.id, formData)
      : this.representativeService.addRepresentative(formData);

    request.subscribe({
      next: (res) => {
        const message = res.message || (this.data ? 'Representante atualizado com sucesso!' : 'Representante criado com sucesso!');
        const type = res.type || 'success';
        this.dialogRef.close({ message, type });
      },
      error: (err) => {
        console.error('Erro ao salvar representante', err);
        const message = err.error?.message || 'Erro ao salvar representante. Tente novamente.';
        this.mostrarFeedback(message, 'error');
      }
    });
  }

  private mostrarFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage.set(message);
    this.feedbackType.set(type);
  }
}