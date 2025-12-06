import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ClassService } from '../../../service/class/class.service';
import { SchoolService } from '../../../service/school/school.service';
import { SchoolFormDialogComponent } from '../../school/school-form-dialog/school-form-dialog.component';
import { ClassFormDialogComponent } from './class-form-dialog.component';

describe('ClassFormDialogComponent', () => {
  let component: ClassFormDialogComponent;
  let fixture: ComponentFixture<ClassFormDialogComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  const mockSchoolService = {
    getAllSchools: jasmine.createSpy('getAllSchools').and.returnValue(of([]))
  };

  const mockClassService = {
    addClass: jasmine.createSpy('addClass'),
    updateClass: jasmine.createSpy('updateClass')
  };

  const mockDialog = {
    open: jasmine.createSpy('open').and.returnValue({
      afterClosed: () => of(null)
    })
  };

  function setup(data: any = null) {
    TestBed.configureTestingModule({
      imports: [ClassFormDialogComponent],
      providers: [
        { provide: SchoolService, useValue: mockSchoolService },
        { provide: ClassService, useValue: mockClassService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    });

    fixture = TestBed.createComponent(ClassFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    mockDialogRef.close.calls.reset();
    mockClassService.addClass.calls.reset();
    mockClassService.updateClass.calls.reset();
    mockDialog.open.calls.reset();
    mockSchoolService.getAllSchools.calls.reset();
    mockSchoolService.getAllSchools.and.returnValue(of([]));
  });

  it('deve criar o componente', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('deve iniciar o formulário vazio quando não houver data', () => {
    setup();

    expect(component.classForm.value).toEqual({
      identificacao: '',
      escola_id: ''
    });
  });

  it('deve fazer patch de dados quando receber MAT_DIALOG_DATA', () => {
    setup({
      id: '10',
      identificacao: 'Turma A',
      escola_id: '5'
    });

    expect(component.classForm.value.identificacao).toBe('Turma A');
    expect(component.classForm.value.escola_id).toBe('5');
  });

  it('deve carregar escolas ao iniciar', () => {
    const mockEscolas = [{ id: '1', nome: 'Escola Teste' }];
    mockSchoolService.getAllSchools.and.returnValue(of(mockEscolas));

    setup();

    expect(component.schoolsList.length).toBe(1);
    expect(component.schoolsList[0].nome).toBe('Escola Teste');
  });

  it('deve mostrar feedback em caso de erro ao carregar escolas', () => {
    mockSchoolService.getAllSchools.and.returnValue(
      throwError(() => ({ error: {} }))
    );

    setup();

    expect(component.feedbackType()).toBe('error');
  });

  it('deve abrir o diálogo de adicionar escola', () => {
    setup();

    component.addSchool();

    expect(mockDialog.open).toHaveBeenCalledWith(
      SchoolFormDialogComponent,
      jasmine.any(Object)
    );
  });

  it('deve atualizar a escola quando addSchool retorna dados', () => {
    mockDialog.open.and.returnValue({
      afterClosed: () => of({ id: '99', message: 'OK', type: 'success' })
    });

    setup();

    component.addSchool();

    expect(component.classForm.value.escola_id).toBe('99');
    expect(component.feedbackMessage()).toBe('OK');
    expect(component.feedbackType()).toBe('success');
    expect(mockSchoolService.getAllSchools).toHaveBeenCalled();
  });

  it('deve chamar addClass ao enviar formulário para novo registro', () => {
    setup();

    component.classForm.setValue({ identificacao: 'Teste', escola_id: '1' });

    mockClassService.addClass.and.returnValue(
      of({ id: '10', message: 'Criado!', type: 'success' })
    );

    component.onSubmit();

    expect(mockClassService.addClass).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      id: '10',
      message: 'Criado!',
      type: 'success'
    });
  });

  it('deve chamar updateClass quando houver data', () => {
    setup({ id: '7', identificacao: 'X', escola_id: '1' });

    component.classForm.setValue({ identificacao: 'Atualizado', escola_id: '2' });

    mockClassService.updateClass.and.returnValue(
      of({ id: '7', message: 'Atualizado!', type: 'success' })
    );

    component.onSubmit();

    expect(mockClassService.updateClass).toHaveBeenCalledWith('7', {
      identificacao: 'Atualizado',
      escola_id: '2'
    });
  });

  it('deve usar mensagem padrão quando updateClass não retorna message/type', () => {
    setup({ id: '44', identificacao: 'Y', escola_id: '3' });

    component.classForm.setValue({ identificacao: 'Z', escola_id: '4' });

    mockClassService.updateClass.and.returnValue(of({ id: '44' }));

    component.onSubmit();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      id: '44',
      message: 'Turma atualizada com sucesso!',
      type: 'success'
    });
  });

  it('não deve enviar se o formulário estiver inválido', () => {
    setup();

    component.classForm.setValue({ identificacao: '', escola_id: '' });

    component.onSubmit();

    expect(mockClassService.addClass).not.toHaveBeenCalled();
    expect(component.classForm.touched).toBeTrue();
  });

  it('deve tratar erro ao enviar formulário', () => {
    setup();

    component.classForm.setValue({ identificacao: 'Teste', escola_id: '1' });

    mockClassService.addClass.and.returnValue(
      throwError(() => ({ error: { message: 'Erro simulado' } }))
    );

    component.onSubmit();

    expect(component.feedbackType()).toBe('error');
    expect(component.feedbackMessage()).toBe('Erro simulado');
  });
});
