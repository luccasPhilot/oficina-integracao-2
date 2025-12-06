import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { SchoolService } from '../../../service/school/school.service';
import { Escola } from '../../../shared/interfaces/escola.interface';
import { SchoolFormDialogComponent } from './school-form-dialog.component';

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
        SchoolFormDialogComponent,
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

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

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

  it('deve marcar todos os campos como touched se o formulário for inválido', () => {
    spyOn(component.schoolForm, 'markAllAsTouched');
    component.onSubmit();
    expect(component.schoolForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('deve marcar erro em cada campo obrigatório individualmente', () => {
    component.schoolForm.setValue({
      nome: '', endereco: '', cidade: '', estado: '', telefone: '', email: ''
    });
    component.onSubmit();
    const controls = component.schoolForm.controls;

    expect(controls['nome'].hasError('required')).toBeTrue();
    expect(controls['endereco'].hasError('required')).toBeTrue();
    expect(controls['cidade'].hasError('required')).toBeTrue();
    expect(controls['estado'].hasError('required')).toBeTrue();
    expect(controls['telefone'].hasError('required')).toBeTrue();
    expect(controls['email'].hasError('required')).toBeTrue();
  });

  it('deve criar nova escola e fechar o diálogo ao enviar formulário válido', () => {
    const spyClose = spyOn(dialogRef, 'close');
    const spyAdd = spyOn(schoolService, 'addSchool').and.callThrough();

    component.schoolForm.setValue({
      nome: 'Nova Escola', endereco: 'Rua X', cidade: 'Cidade Y',
      estado: 'RJ', telefone: '11988888888', email: 'nova@escola.com'
    });

    component.onSubmit();

    expect(spyAdd).toHaveBeenCalled();
    expect(spyClose).toHaveBeenCalledWith(jasmine.objectContaining({ id: '123', type: 'success' }));
  });

  it('deve atualizar escola existente e fechar o diálogo', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [SchoolFormDialogComponent, ReactiveFormsModule],
      providers: [
        { provide: SchoolService, useClass: SchoolServiceMock },
        { provide: MatDialogRef, useClass: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockSchool }
      ]
    });
    const fixture2 = TestBed.createComponent(SchoolFormDialogComponent);
    const component2 = fixture2.componentInstance;
    fixture2.detectChanges();

    const spyUpdate = spyOn(component2['schoolService'], 'updateSchool').and.callThrough();
    const spyClose = spyOn(component2.dialogRef, 'close');

    component2.schoolForm.patchValue({ nome: 'Atualizada' });
    component2.onSubmit();

    expect(spyUpdate).toHaveBeenCalledWith('1', jasmine.objectContaining({ nome: 'Atualizada' }));
    expect(spyClose).toHaveBeenCalled();
  });

  it('deve usar mensagens padrão se res.message e res.type forem undefined', () => {
    spyOn(component['schoolService'], 'addSchool').and.returnValue(of({ id: '999' }));
    const spyClose = spyOn(component.dialogRef, 'close');

    component.schoolForm.setValue({
      nome: 'Teste', endereco: 'Rua', cidade: 'Cidade', estado: 'SP', telefone: '1111', email: 'a@b.com'
    });

    component.onSubmit();

    expect(spyClose).toHaveBeenCalledWith({
      id: '999',
      message: 'Escola criada com sucesso!',
      type: 'success'
    });
  });

  it('deve mostrar feedback de erro com err.error.message', () => {
    spyOn(schoolService, 'addSchool').and.returnValue(throwError(() => ({ error: { message: 'Falha X' } })));
    component.schoolForm.setValue({
      nome: 'AAA', endereco: 'BBB', cidade: 'CCC', estado: 'SP', telefone: '111', email: 'a@b.com'
    });
    component.onSubmit();
    expect(component.feedbackType()).toBe('error');
    expect(component.feedbackMessage()).toBe('Falha X');
  });

  it('deve mostrar feedback de erro com fallback padrão', () => {
    spyOn(schoolService, 'addSchool').and.returnValue(throwError(() => ({})));
    component.schoolForm.setValue({
      nome: 'AAA', endereco: 'BBB', cidade: 'CCC', estado: 'SP', telefone: '111', email: 'a@b.com'
    });
    component.onSubmit();
    expect(component.feedbackType()).toBe('error');
    expect(component.feedbackMessage()).toBe('Erro ao salvar Escola. Tente novamente.');
  });

  it('deve definir feedbackMessage e feedbackType', () => {
    component['mostrarFeedback']('Erro X', 'error');
    expect(component.feedbackMessage()).toBe('Erro X');
    expect(component.feedbackType()).toBe('error');
  });
});
