import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialog, useValue: {} }
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
    component.studentForm.setValue({ nome: 'Aluno Teste', idade: 10, turma_id: '1' });
    component.onSubmit();
    expect(mockStudentService.addStudent).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ message: 'ok', type: 'success' });
  });

  it('não deve enviar se o formulário for inválido', () => {
    component.studentForm.setValue({ nome: '', idade: null, turma_id: '' });
    component.onSubmit();
    expect(mockStudentService.addStudent).not.toHaveBeenCalled();
    expect(mockStudentService.updateStudent).not.toHaveBeenCalled();
  });

  it('deve atualizar aluno quando data existir', () => {
    const alunoData = { id: '10', nome: 'X', idade: 15, turma_id: '2' };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: StudentService, useValue: mockStudentService },
        { provide: ClassService, useValue: mockClassService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: alunoData },
        { provide: MatDialog, useValue: {} }
      ],
      imports: [StudentFormDialogComponent]
    }).compileComponents();

    const fixture2 = TestBed.createComponent(StudentFormDialogComponent);
    const comp2 = fixture2.componentInstance;
    fixture2.detectChanges();

    comp2.studentForm.setValue({ nome: 'Novo Nome', idade: 20, turma_id: '3' });
    comp2.onSubmit();

    expect(mockStudentService.updateStudent).toHaveBeenCalledWith('10', { nome: 'Novo Nome', idade: 20, turma_id: '3' });
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('deve usar mensagens padrão quando res.message e res.type forem undefined', () => {
    mockStudentService.addStudent.and.returnValue(of({}));
    component.studentForm.setValue({ nome: 'Teste', idade: 10, turma_id: '1' });
    component.onSubmit();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ message: 'Aluno criado com sucesso!', type: 'success' });
  });

  it('deve mostrar feedback ao falhar salvar aluno', () => {
    mockStudentService.addStudent.and.returnValue(
      throwError(() => ({ error: { message: 'Erro ao salvar aluno' } }))
    );
    component.studentForm.setValue({ nome: 'Erro', idade: 10, turma_id: '1' });
    component.onSubmit();
    expect(component.feedbackMessage()).toBe('Erro ao salvar aluno');
    expect(component.feedbackType()).toBe('error');
  });

  it('deve adicionar turma ao clicar em addClass() com resultado', () => {
    const dialogMock = {
      open: () => ({ afterClosed: () => of({ id: '99', message: 'ok', type: 'success' }) })
    };
    (component as any).dialog = dialogMock;
    spyOn(component.studentForm, 'patchValue');
    spyOn(component, 'getClasses');

    component.addClass();

    expect(component.studentForm.patchValue).toHaveBeenCalledWith({ turma_id: '99' });
    expect(component.feedbackMessage()).toBe('ok');
    expect(component.feedbackType()).toBe('success');
    expect(component.getClasses).toHaveBeenCalled();
  });

  it('não deve atualizar turma se addClass fechar sem resultado', () => {
    const dialogMock = { open: () => ({ afterClosed: () => of(undefined) }) };
    (component as any).dialog = dialogMock;
    spyOn(component.studentForm, 'patchValue');

    component.addClass();

    expect(component.studentForm.patchValue).not.toHaveBeenCalled();
    expect(component.feedbackMessage()).toBe('');
    expect(component.feedbackType()).toBe('');
  });

  it('deve marcar erro de idade menor que 1', () => {
    component.studentForm.setValue({ nome: 'Teste', idade: 0, turma_id: '1' });
    component.onSubmit();
    expect(component.studentForm.get('idade')?.hasError('min')).toBeTrue();
  });

  it('deve marcar erro de idade maior que 120', () => {
    component.studentForm.setValue({ nome: 'Teste', idade: 150, turma_id: '1' });
    component.onSubmit();
    expect(component.studentForm.get('idade')?.hasError('max')).toBeTrue();
  });

  it('deve aceitar idade nos limites 1 e 120', () => {
    component.studentForm.setValue({ nome: 'Teste', idade: 1, turma_id: '1' });
    component.onSubmit();
    expect(component.studentForm.get('idade')?.hasError('min')).toBeFalse();

    component.studentForm.setValue({ nome: 'Teste', idade: 120, turma_id: '1' });
    component.onSubmit();
    expect(component.studentForm.get('idade')?.hasError('max')).toBeFalse();
  });

  it('deve marcar erro de nome obrigatório', () => {
    component.studentForm.setValue({ nome: '', idade: 10, turma_id: '1' });
    component.onSubmit();
    expect(component.studentForm.get('nome')?.hasError('required')).toBeTrue();
  });

  it('deve marcar erro de turma_id obrigatório', () => {
    component.studentForm.setValue({ nome: 'Teste', idade: 10, turma_id: '' });
    component.onSubmit();
    expect(component.studentForm.get('turma_id')?.hasError('required')).toBeTrue();
  });
});
