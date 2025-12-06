import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ClassService } from '../../../service/class/class.service';
import { StudentService } from '../../../service/student/student.service';
import { StudentFormDialogComponent } from './student-form-dialog.component';

describe('StudentFormDialogComponent', () => {
  let component: StudentFormDialogComponent;
  let fixture: ComponentFixture<StudentFormDialogComponent>;

  let mockStudentService: any;
  let mockClassService: any;
  let mockDialogRef: any;

  beforeEach(async () => {
    mockStudentService = {
      addStudent: jasmine.createSpy('addStudent').and.returnValue(of({ message: 'ok', type: 'success' })),
      updateStudent: jasmine.createSpy('updateStudent').and.returnValue(of({ message: 'atualizado', type: 'success' }))
    };

    mockClassService = {
      getAllClasses: jasmine.createSpy('getAllClasses').and.returnValue(of([]))
    };

    mockDialogRef = {
      close: jasmine.createSpy('close')
    };

    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: StudentService, useValue: mockStudentService },
        { provide: ClassService, useValue: mockClassService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null }
      ],
      imports: [StudentFormDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar lista de turmas no ngOnInit', () => {
    expect(mockClassService.getAllClasses).toHaveBeenCalled();
  });

  it('deve mostrar feedback de erro ao falhar getClasses()', () => {
    mockClassService.getAllClasses.and.returnValue(
      throwError(() => ({ error: { message: 'erro' } }))
    );

    component.getClasses();

    expect(component.feedbackMessage()).toBe('Erro ao buscar turmas. Tente novamente.');
    expect(component.feedbackType()).toBe('error');
  });

  it('deve criar aluno ao enviar formulário válido (sem data/edição)', () => {
    component.studentForm.setValue({
      nome: 'Aluno Teste',
      idade: 10,
      turma_id: '1'
    });

    component.onSubmit();

    expect(mockStudentService.addStudent).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ message: 'ok', type: 'success' });
  });

  it('não deve enviar se o formulário for inválido', () => {
    component.studentForm.setValue({
      nome: '',
      idade: null,
      turma_id: ''
    });

    component.onSubmit();

    expect(mockStudentService.addStudent).not.toHaveBeenCalled();
    expect(mockStudentService.updateStudent).not.toHaveBeenCalled();
  });

  it('deve atualizar aluno quando data existir', () => {
    const alunoData = { id: '10', nome: 'X', idade: 15, turma_id: '2' };

    // recriar componente agora com MAT_DIALOG_DATA
    const fixture2 = TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: alunoData })
      .createComponent(StudentFormDialogComponent);

    const comp2 = fixture2.componentInstance;

    comp2.studentForm.setValue({
      nome: 'Novo Nome',
      idade: 20,
      turma_id: '3'
    });

    comp2.onSubmit();

    expect(mockStudentService.updateStudent).toHaveBeenCalled();
  });

  it('deve mostrar feedback ao falhar salvar aluno', () => {
    mockStudentService.addStudent.and.returnValue(
      throwError(() => ({ error: { message: 'Erro ao salvar aluno' } }))
    );

    component.studentForm.setValue({
      nome: 'Erro',
      idade: 10,
      turma_id: '1'
    });

    component.onSubmit();

    expect(component.feedbackMessage()).toBe('Erro ao salvar aluno');
    expect(component.feedbackType()).toBe('error');
  });

  it('deve adicionar turma ao clicar em addClass()', () => {
    const dialogMock = {
      open: () => ({
        afterClosed: () => of({ id: '99', message: 'ok', type: 'success' })
      })
    };

    (component as any).dialog = dialogMock;

    spyOn(component.studentForm, 'patchValue');

    component.addClass();

    expect(component.studentForm.patchValue).toHaveBeenCalledWith({ turma_id: '99' });
  });
});
