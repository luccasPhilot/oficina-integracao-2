import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { ClassService } from '../../service/class/class.service';
import { RepresentativeService } from '../../service/representative/representative.service';
import { SchoolService } from '../../service/school/school.service';
import { StudentService } from '../../service/student/student.service';
import { FeedbackPopupComponent } from "../../shared/components/feedback-popup/feedback-popup.component";
import { PageComponent } from '../../shared/components/page/page.component';
import { Aluno } from '../../shared/interfaces/aluno.interface';
import { Escola } from '../../shared/interfaces/escola.interface';
import { Representante } from '../../shared/interfaces/representante.interface';
import { Turma } from '../../shared/interfaces/turma.interface';

@Component({
  selector: 'app-dashboard',
  imports: [PageComponent, MatIconModule, FeedbackPopupComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  classesList: Turma[] = [];
  schoolsList: Escola[] = [];
  representativeList: Representante[] = [];
  studentList: Aluno[] = [];

  feedbackMessage = signal<string>('');
  feedbackType = signal<'success' | 'error' | ''>('');

  private readonly classService = inject(ClassService);
  private readonly schoolService = inject(SchoolService);
  private readonly representativeService = inject(RepresentativeService);
  private readonly studentService = inject(StudentService);

  ngOnInit(): void {
    this.getClasses();
    this.getSchools();
    this.getRepresentatives();
    this.getStudents();
  }

  getClasses(): void {
    this.classService.getAllClasses()
      .subscribe({
        next: (result: Turma[]) => {
          this.classesList = result;
        },
        error: (err) => {
          this.mostrarFeedback('Erro ao buscar turmas. Tente novamente.', 'error');
        }
      });
  }

  getSchools(): void {
    this.schoolService.getAllSchools()
      .subscribe({
        next: (result: Escola[]) => {
          this.schoolsList = result;
        },
        error: (err) => {
          this.mostrarFeedback('Erro ao buscar escolas. Tente novamente.', 'error');
        }
      });
  }

  getRepresentatives(): void {
    this.representativeService.getAllRepresentatives()
      .subscribe({
        next: (result: Representante[]) => {
          this.representativeList = result;
        },
        error: (err) => {
          this.mostrarFeedback('Erro ao buscar representantes. Tente novamente.', 'error');
        }
      });
  }

  getStudents(): void {
    this.studentService.getAllStudents()
      .subscribe({
        next: (result: Aluno[]) => {
          this.studentList = result;
        },
        error: (err) => {
          this.mostrarFeedback('Erro ao buscar alunos. Tente novamente.', 'error');
        }
      });
  }

  private mostrarFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage.set(message);
    this.feedbackType.set(type);
  }
}
