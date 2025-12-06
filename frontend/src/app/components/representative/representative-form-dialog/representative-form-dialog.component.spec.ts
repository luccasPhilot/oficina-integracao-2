import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { RepresentativeService } from '../../../service/representative/representative.service';
import { SchoolService } from '../../../service/school/school.service';
import { RepresentativeFormDialogComponent } from './representative-form-dialog.component';

describe('RepresentativeFormDialogComponent', () => {
  let component: RepresentativeFormDialogComponent;

  let representativeServiceMock: jasmine.SpyObj<RepresentativeService>;
  let schoolServiceMock: jasmine.SpyObj<SchoolService>;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<RepresentativeFormDialogComponent>>;

  const mockSchools = [
    { id: '1', nome: 'Escola Teste A', endereco: '', telefone: '', cidade: '', uf: '' },
    { id: '2', nome: 'Escola Teste B', endereco: '', telefone: '', cidade: '', uf: '' }
  ];

  const mockData = {
    id: '10',
    nome: 'Maria',
    cargo: 'Coordenadora',
    telefone: '9999',
    escola_id: '1'
  };

  beforeEach(() => {

    representativeServiceMock = jasmine.createSpyObj('RepresentativeService', [
      'addRepresentative',
      'updateRepresentative'
    ]);

    schoolServiceMock = jasmine.createSpyObj('SchoolService', [
      'getAllSchools'
    ]);

    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [RepresentativeFormDialogComponent],
      providers: [
        { provide: RepresentativeService, useValue: representativeServiceMock },
        { provide: SchoolService, useValue: schoolServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: null }
      ]
    });

    const fixture = TestBed.createComponent(RepresentativeFormDialogComponent);
    component = fixture.componentInstance;
  });

  it('deve inicializar o formulário vazio quando NÃO há data', () => {
    expect(component.representativeForm.value).toEqual({
      nome: '',
      cargo: '',
      telefone: '',
      escola_id: ''
    });
  });

  it('deve preencher o formulário quando houver data no MAT_DIALOG_DATA', () => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      imports: [RepresentativeFormDialogComponent],
      providers: [
        { provide: RepresentativeService, useValue: representativeServiceMock },
        { provide: SchoolService, useValue: schoolServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    });

    const fixture = TestBed.createComponent(RepresentativeFormDialogComponent);
    const comp = fixture.componentInstance;

    expect(comp.representativeForm.value).toEqual({
      nome: 'Maria',
      cargo: 'Coordenadora',
      telefone: '9999',
      escola_id: '1'
    });
  });

  it('ngOnInit deve chamar getSchools()', () => {
    spyOn(component, 'getSchools');
    component.ngOnInit();
    expect(component.getSchools).toHaveBeenCalled();
  });

  it('getSchools deve popular schoolsList quando sucesso', () => {
    schoolServiceMock.getAllSchools.and.returnValue(of(mockSchools));
    component.getSchools();
    expect(component.schoolsList).toEqual(mockSchools);
  });

  it('getSchools deve registrar erro e disparar feedback quando falhar', () => {
    schoolServiceMock.getAllSchools.and.returnValue(
      throwError(() => ({ error: 'erro' }))
    );

    spyOn<any>(component, 'mostrarFeedback');

    component.getSchools();

    expect(component['mostrarFeedback']).toHaveBeenCalledWith(
      'Erro ao buscar escolas. Tente novamente.',
      'error'
    );
  });

  it('addSchool deve abrir dialog e atualizar escola_id e feedback', () => {
    const resultData = {
      id: '99',
      message: 'Escola adicionada',
      type: 'success'
    };

    dialogMock.open.and.returnValue({
      afterClosed: () => of(resultData)
    } as any);

    spyOn(component, 'getSchools');

    component.addSchool();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(component.representativeForm.get('escola_id')?.value).toBe('99');
    expect(component.feedbackMessage()).toBe('Escola adicionada');
    expect(component.feedbackType()).toBe('success');
    expect(component.getSchools).toHaveBeenCalled();
  });

  it('onSubmit deve marcar campos como tocados quando inválido', () => {
    component.representativeForm.patchValue({ nome: '', escola_id: '' });
    spyOn(component.representativeForm, 'markAllAsTouched');

    component.onSubmit();

    expect(component.representativeForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('onSubmit deve criar representante quando não houver data', () => {
    representativeServiceMock.addRepresentative.and.returnValue(
      of({ message: 'Criado!', type: 'success' })
    );

    component.representativeForm.patchValue({
      nome: 'João',
      cargo: 'Coord',
      telefone: '8888',
      escola_id: '1'
    });

    component.onSubmit();

    expect(representativeServiceMock.addRepresentative).toHaveBeenCalled();
    expect(dialogRefMock.close).toHaveBeenCalledWith({
      message: 'Criado!',
      type: 'success'
    });
  });

  it('onSubmit deve atualizar representante quando houver data', () => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      imports: [RepresentativeFormDialogComponent],
      providers: [
        { provide: RepresentativeService, useValue: representativeServiceMock },
        { provide: SchoolService, useValue: schoolServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    });

    const fixture = TestBed.createComponent(RepresentativeFormDialogComponent);
    const comp = fixture.componentInstance;

    representativeServiceMock.updateRepresentative.and.returnValue(
      of({ message: 'Atualizado!', type: 'success' })
    );

    comp.onSubmit();

    expect(representativeServiceMock.updateRepresentative)
      .toHaveBeenCalledWith('10', jasmine.any(Object));

    expect(dialogRefMock.close).toHaveBeenCalledWith({
      message: 'Atualizado!',
      type: 'success'
    });
  });

  it('onSubmit deve aplicar feedback de erro quando API falhar', () => {
    representativeServiceMock.addRepresentative.and.returnValue(
      throwError(() => ({ error: { message: 'Falha grave' } }))
    );

    component.representativeForm.patchValue({
      nome: 'João',
      cargo: 'Coord',
      telefone: '8888',
      escola_id: '1'
    });

    spyOn<any>(component, 'mostrarFeedback');

    component.onSubmit();

    expect(component['mostrarFeedback']).toHaveBeenCalledWith(
      'Falha grave',
      'error'
    );
  });

  it('mostrarFeedback deve atualizar signals', () => {
    const anyComp = component as any;

    anyComp.mostrarFeedback('OK', 'success');

    expect(component.feedbackMessage()).toBe('OK');
    expect(component.feedbackType()).toBe('success');
  });
});
