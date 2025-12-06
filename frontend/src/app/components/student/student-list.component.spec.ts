import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { StudentService } from '../../service/student/student.service';
import { Aluno } from '../../shared/interfaces/aluno.interface';
import { StudentListComponent } from './student-list.component';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let studentServiceSpy: jasmine.SpyObj<StudentService>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    studentServiceSpy = jasmine.createSpyObj('StudentService', [
      'getAllStudents',
      'deleteStudent'
    ]);

    await TestBed.configureTestingModule({
      imports: [StudentListComponent, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: StudentService, useValue: studentServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    studentServiceSpy.getAllStudents.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve carregar alunos no ngOnInit', () => {
    const mockStudents: Aluno[] = [
      { id: '1', nome: 'Teste', turma_id: '1' }
    ];
    studentServiceSpy.getAllStudents.and.returnValue(of(mockStudents));
    fixture.detectChanges();
    expect(component.studentsList.length).toBe(1);
  });

  it('deve tratar erro ao carregar alunos', () => {
    spyOn(console, 'error');
    studentServiceSpy.getAllStudents.and.returnValue(throwError(() => new Error('Erro')));
    fixture.detectChanges();
    expect(component.feedbackType()).toBe('error');
  });

  it('getInitials deve retornar iniciais corretas', () => {
    expect(component.getInitials('João Silva')).toBe('JS');
    expect(component.getInitials('Maria')).toBe('MA');
    expect(component.getInitials('')).toBe('');
  });

  it('deve abrir o diálogo ao adicionar aluno e tratar retorno', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of({ message: 'Criado', type: 'success' })
    } as any);

    const getStudentsSpy = spyOn(component, 'getStudents');

    component.addStudent();

    expect(getStudentsSpy).toHaveBeenCalled();
    expect(component.feedbackMessage()).toBe('Criado');
    expect(component.feedbackType()).toBe('success');
  });

  it('não deve atualizar nada se addStudent fechar sem retorno', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(null)
    } as any);

    const getStudentsSpy = spyOn(component, 'getStudents');

    component.addStudent();

    expect(getStudentsSpy).not.toHaveBeenCalled();
  });

  it('deve abrir o diálogo ao editar aluno e tratar retorno', () => {
    const mockStudent: Aluno = {
      id: '1',
      nome: 'Aluno Teste',
      turma_id: '2'
    };

    dialogSpy.open.and.returnValue({
      afterClosed: () => of({ message: 'Alterado', type: 'success' })
    } as any);

    const getStudentsSpy = spyOn(component, 'getStudents');

    component.editStudent(mockStudent, new MouseEvent('click'));

    expect(getStudentsSpy).toHaveBeenCalled();
    expect(component.feedbackMessage()).toBe('Alterado');
  });

  it('não deve atualizar nada se editStudent fechar sem retorno', () => {
    const mockStudent: Aluno = {
      id: '1',
      nome: 'Aluno Teste',
      turma_id: '2'
    };

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(null)
    } as any);

    const getStudentsSpy = spyOn(component, 'getStudents');

    component.editStudent(mockStudent, new MouseEvent('click'));

    expect(getStudentsSpy).not.toHaveBeenCalled();
  });

  it('deve deletar aluno com sucesso', () => {
    const mockStudent: Aluno = {
      id: '1',
      nome: 'Aluno Teste',
      turma_id: '5'
    };

    studentServiceSpy.deleteStudent.and.returnValue(of({ message: 'OK' }));

    const getStudentsSpy = spyOn(component, 'getStudents');

    component.deleteStudent(mockStudent, new MouseEvent('click'));

    expect(getStudentsSpy).toHaveBeenCalled();
    expect(component.feedbackMessage()).toBe('OK');
    expect(component.feedbackType()).toBe('success');
  });

  it('deve tratar erro ao deletar aluno', () => {
    spyOn(console, 'error');

    const mockStudent: Aluno = {
      id: '1',
      nome: 'Aluno Teste',
      turma_id: '5'
    };

    studentServiceSpy.deleteStudent.and.returnValue(throwError(() => new Error('Erro')));

    component.deleteStudent(mockStudent, new MouseEvent('click'));

    expect(component.feedbackType()).toBe('error');
  });

  it('listHasStudents deve retornar true quando todos filtered forem true', () => {
    component.studentsList = [
      { id: '1', nome: 'A', turma_id: '1', filtered: true },
      { id: '2', nome: 'B', turma_id: '2', filtered: true }
    ];
    expect(component.listHasStudents()).toBeTrue();
  });

  it('listHasStudents deve retornar false quando algum filtered for false', () => {
    component.studentsList = [
      { id: '1', nome: 'A', turma_id: '1', filtered: false },
      { id: '2', nome: 'B', turma_id: '2', filtered: true }
    ];
    expect(component.listHasStudents()).toBeFalse();
  });
});
