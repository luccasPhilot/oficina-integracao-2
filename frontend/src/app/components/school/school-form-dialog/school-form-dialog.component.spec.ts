import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { SchoolService } from '../../../service/school/school.service';
import { Escola } from '../../../shared/interfaces/escola.interface';
import { SchoolFormDialogComponent } from './school-form-dialog.component';

// ==============================
// MOCKS
// ==============================

class SchoolServiceMock {
  addSchool(data: any) {
    return of({ id: '123', message: 'Criado', type: 'success' });
  }

  updateSchool(id: string, data: any) {
    return of({ id, message: 'Atualizado', type: 'success' });
  }
}

class MatDialogRefMock {
  close(value?: any) { }
}

// ==============================
// TESTES
// ==============================

describe('SchoolFormDialogComponent', () => {
  let component: SchoolFormDialogComponent;
  let fixture: ComponentFixture<SchoolFormDialogComponent>;
  let schoolService: SchoolServiceMock;
  let dialogRef: MatDialogRefMock;

  const mockSchool: Escola = {
    id: '1',
    nome: 'Escola Teste',
    endereco: 'Rua A',
    cidade: 'Cidade X',
    estado: 'SP',
    telefone: '11999999999',
    email: 'teste@teste.com',
    createdAt: 'date',
    filtered: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SchoolFormDialogComponent, // standalone component
        ReactiveFormsModule
      ],
      providers: [
        { provide: SchoolService, useClass: SchoolServiceMock },
        { provide: MatDialogRef, useClass: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: null }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolFormDialogComponent);
    component = fixture.componentInstance;

    schoolService = TestBed.inject(SchoolService) as any;
    dialogRef = TestBed.inject(MatDialogRef) as any;

    fixture.detectChanges();
  });

  // =====================================
  // TESTES BÁSICOS
  // =====================================

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  // =====================================
  // FORMULÁRIO - EDIÇÃO
  // =====================================

  it('deve preencher o formulário se receber dados para edição', () => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      imports: [SchoolFormDialogComponent],
      providers: [
        { provide: SchoolService, useClass: SchoolServiceMock },
        { provide: MatDialogRef, useClass: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockSchool }
      ]
    });

    const fixture2 = TestBed.createComponent(SchoolFormDialogComponent);
    const component2 = fixture2.componentInstance;
    fixture2.detectChanges();

    expect(component2.schoolForm.value.nome).toBe('Escola Teste');
    expect(component2.schoolForm.value.estado).toBe('SP');
  });

  // =====================================
  // FORMULÁRIO - VALIDAÇÃO
  // =====================================

  it('deve marcar todos os campos como touched se o formulário for inválido', () => {
    spyOn(component.schoolForm, 'markAllAsTouched');

    component.onSubmit();

    expect(component.schoolForm.markAllAsTouched).toHaveBeenCalled();
  });

  // =====================================
  // CRIAÇÃO DE ESCOLA
  // =====================================

  it('deve criar nova escola e fechar o diálogo ao enviar formulário válido', () => {
    const spyClose = spyOn(dialogRef, 'close');
    const spyAdd = spyOn(schoolService, 'addSchool').and.callThrough();

    component.schoolForm.setValue({
      nome: 'Nova Escola',
      endereco: 'Rua X',
      cidade: 'Cidade Y',
      estado: 'RJ',
      telefone: '11988888888',
      email: 'nova@escola.com'
    });

    component.onSubmit();

    expect(spyAdd).toHaveBeenCalled();
    expect(spyClose).toHaveBeenCalledWith(jasmine.objectContaining({
      id: '123',
      type: 'success'
    }));
  });

  // =====================================
  // EDIÇÃO DE ESCOLA
  // =====================================

  // it('deve atualizar escola existente', () => {
  //   TestBed.resetTestingModule();

  //   TestBed.configureTestingModule({
  //     imports: [SchoolFormDialogComponent],
  //     providers: [
  //       { provide: SchoolService, useClass: SchoolServiceMock },
  //       { provide: MatDialogRef, useClass: MatDialogRefMock },
  //       { provide: MAT_DIALOG_DATA, useValue: mockSchool }
  //     ]
  //   });

  //   const fixture2 = TestBed.createComponent(SchoolFormDialogComponent);
  //   const component2 = fixture2.componentInstance;
  //   fixture2.detectChanges();

  //   const spyClose = spyOn(component2.dialogRef, 'close');
  //   const spyUpdate = spyOn(schoolService, 'updateSchool').and.callThrough();

  //   component2.onSubmit();

  //   expect(spyUpdate).toHaveBeenCalledWith('1', jasmine.any(Object));
  //   expect(spyClose).toHaveBeenCalled();
  // });

  // =====================================
  // ERRO NO REQUEST
  // =====================================

  it('deve mostrar feedback de erro caso ocorra falha', () => {
    const spyAdd = spyOn(schoolService, 'addSchool').and.returnValue(
      throwError(() => ({
        error: { message: 'Falha gravíssima' }
      }))
    );

    component.schoolForm.setValue({
      nome: 'AAA',
      endereco: 'BBB',
      cidade: 'CCC',
      estado: 'SP',
      telefone: '1111',
      email: 'aaa@aaa.com'
    });

    component.onSubmit();

    expect(component.feedbackType()).toBe('error');
    expect(component.feedbackMessage()).toBe('Falha gravíssima');
  });

  // =====================================
  // TESTE DO MÉTODO mostrarFeedback
  // =====================================

  it('deve definir feedbackMessage e feedbackType', () => {
    component['mostrarFeedback']('Erro X', 'error');

    expect(component.feedbackMessage()).toBe('Erro X');
    expect(component.feedbackType()).toBe('error');
  });

});
