import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, throwError } from 'rxjs';
import { SchoolService } from '../../service/school/school.service';
import { Escola } from '../../shared/interfaces/escola.interface';
import { SchoolListComponent } from './school-list.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ message: 'ok', type: 'success' })
    };
  }
}

class SchoolServiceMock {
  getAllSchools(): Observable<Escola[]> {
    return of([] as Escola[]);
  }
  deleteSchool(id: string): Observable<any> {
    return of({ message: 'ok' });
  }
}

describe('SchoolListComponent', () => {
  let component: SchoolListComponent;
  let fixture: ComponentFixture<SchoolListComponent>;
  let schoolService: SchoolServiceMock;
  let dialog: MatDialogMock;

  const mockSchools: Escola[] = [
    {
      id: '1',
      nome: 'Escola Teste A',
      endereco: '',
      telefone: '',
      cidade: 'Cidade A',
      estado: 'SP',
      email: '',
      createdAt: "date",
      filtered: false
    },
    {
      id: '2',
      nome: 'Escola Teste B',
      endereco: '',
      telefone: '',
      cidade: 'Cidade B',
      estado: 'RJ',
      email: '',
      createdAt: "date",
      filtered: false
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolListComponent, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: SchoolService, useClass: SchoolServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolListComponent);
    component = fixture.componentInstance;

    schoolService = TestBed.inject(SchoolService) as any;
    dialog = TestBed.inject(MatDialog) as any;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar escolas no ngOnInit', () => {
    spyOn(schoolService, 'getAllSchools').and.returnValue(of(mockSchools));

    component.ngOnInit();

    expect(component.schoolsList).toEqual(mockSchools);
  });

  it('deve tratar erro ao carregar escolas', () => {
    spyOn(schoolService, 'getAllSchools').and.returnValue(throwError(() => new Error()));

    component.getSchools();

    expect(component.feedbackType()).toBe('error');
  });

  it('deve retornar iniciais corretamente', () => {
    expect(component.getInitials('Maria Joaquina')).toBe('MJ');
    expect(component.getInitials('Carlos')).toBe('CA');
    expect(component.getInitials('')).toBe('');
  });

  it('deve abrir modal ao adicionar escola', () => {
    spyOn(dialog, 'open').and.callThrough();
    spyOn(component, 'getSchools');

    component.addSchool();

    expect(dialog.open).toHaveBeenCalled();
    expect(component.getSchools).toHaveBeenCalled();
  });

  it('deve abrir modal ao editar escola', () => {
    spyOn(dialog, 'open').and.callThrough();
    spyOn(component, 'getSchools');

    const event = new MouseEvent('click');
    const school = mockSchools[0];

    component.editSchool(school, event);

    expect(dialog.open).toHaveBeenCalled();
    expect(component.getSchools).toHaveBeenCalled();
  });

  it('deve deletar escola', () => {
    spyOn(schoolService, 'deleteSchool').and.returnValue(of({ message: 'ok' }));
    spyOn(component, 'getSchools');

    const event = new MouseEvent('click');
    const school = mockSchools[0];

    component.deleteSchool(school, event);

    expect(schoolService.deleteSchool).toHaveBeenCalledWith(school.id);
    expect(component.getSchools).toHaveBeenCalled();
  });

  it('listHasSchools deve retornar true só quando todas escolas estão filtradas', () => {
    component.schoolsList = [
      { ...mockSchools[0], filtered: true },
      { ...mockSchools[1], filtered: true }
    ];

    expect(component.listHasSchools()).toBeTrue();

    component.schoolsList = [
      { ...mockSchools[0], filtered: false },
      { ...mockSchools[1], filtered: true }
    ];

    expect(component.listHasSchools()).toBeFalse();
  });

});
