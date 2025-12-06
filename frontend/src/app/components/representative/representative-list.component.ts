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


  mockRepresentantes: Representante[] = [
    {
      id: 'R0000001',
      nome: 'Mariana Silva Costa',
      cargo: 'Coordenadora',
      telefone: '(11) 91234-5678',
      escola_id: 'E0000001',
      createdAt: '2025-01-10T08:00:00.000Z',
      escola: {
        id: 'E0000001',
        nome: 'Escola Estadual Monte Castelo',
        cidade: 'São Paulo',
        estado: 'SP',
        createdAt: '2024-02-15T10:00:00.000Z',
      },
    },
    {
      id: 'R0000002',
      nome: 'Carlos Henrique dos Santos',
      cargo: 'Vice-diretor',
      telefone: '(21) 99876-5432',
      escola_id: 'E0000002',
      createdAt: '2025-01-12T09:15:00.000Z',
      escola: {
        id: 'E0000002',
        nome: 'Colégio Municipal Paulo Freire',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        createdAt: '2024-03-20T11:00:00.000Z',
      },
    },
    {
      id: 'R0000003',
      nome: 'Fernanda Almeida Lopes',
      cargo: 'Professora responsável',
      telefone: '(31) 98765-4321',
      escola_id: 'E0000003',
      createdAt: '2025-02-02T14:30:00.000Z',
      escola: {
        id: 'E0000003',
        nome: 'Centro Educacional Horizonte',
        cidade: 'Belo Horizonte',
        estado: 'MG',
        createdAt: '2024-05-12T09:45:00.000Z',
      },
    },
    {
      id: 'R0000004',
      nome: 'João Pedro Almeida',
      cargo: 'Representante estudantil',
      telefone: '(41) 91234-9999',
      escola_id: 'E0000004',
      createdAt: '2025-03-01T12:00:00.000Z',
      escola: {
        id: 'E0000004',
        nome: 'Instituto Educacional Aurora',
        cidade: 'Curitiba',
        estado: 'PR',
        createdAt: '2024-07-21T13:00:00.000Z',
      },
    },
    {
      id: 'R0000005',
      nome: 'Luciana Torres',
      cargo: 'Diretora',
      telefone: '(51) 93456-7788',
      escola_id: 'E0000005',
      createdAt: '2025-03-25T16:20:00.000Z',
      escola: {
        id: 'E0000005',
        nome: 'Escola Técnica Novo Horizonte',
        cidade: 'Porto Alegre',
        estado: 'RS',
        createdAt: '2024-09-01T10:00:00.000Z',
      },
    },
  ];

  readonly panelOpenState = signal(false);

  feedbackMessage = signal<string>('');
  feedbackType = signal<'success' | 'error' | ''>('');

  private readonly dialog = inject(MatDialog);
  private readonly representativesService = inject(RepresentativeService);

  ngOnInit(): void {
    this.getRepresentatives();
  }

  getRepresentatives(): void {
    // this.representativesService.getAllRepresentatives()
    //   .subscribe({
    //     next: (result: Representante[]) => {
    //       this.representativesList = result;
    //     },
    //     error: (err) => {
    //       this.mostrarFeedback('Erro ao buscar representantes. Tente novamente.', 'error');
    //     }
    //   });

    this.representativesList = this.mockRepresentantes;
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
