import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ClassService } from '../../service/class/class.service';
import { Turma } from '../../shared/interfaces/turma.interface';
import { ClassFormDialogComponent } from './class-form-dialog/class-form-dialog.component';
import { ClassListComponent } from './class-list.component';

describe('ClassListComponent', () => {
  let component: ClassListComponent;
  let fixture: ComponentFixture<ClassListComponent>;
  let classServiceMock: any;
  let dialogMock: any;

  beforeEach(async () => {
    classServiceMock = {
      getAllClasses: jasmine.createSpy('getAllClasses'),
      deleteClass: jasmine.createSpy('deleteClass')
    };

    dialogMock = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(null)
      })
    };

    await TestBed.configureTestingModule({
      imports: [ClassListComponent, HttpClientTestingModule],
      providers: [
        { provide: ClassService, useValue: classServiceMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassListComponent);
    component = fixture.componentInstance;
  });

  // --------------------------------------------------------
  // ngOnInit
  // --------------------------------------------------------
  it('should call getClasses on init', () => {
    classServiceMock.getAllClasses.and.returnValue(of([]));
    const spy = spyOn(component, 'getClasses').and.callThrough();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  // --------------------------------------------------------
  // getClasses (sucesso)
  // --------------------------------------------------------
  it('should load class list correctly', () => {
    const mockData = [
      {
        id: 1,
        identificacao: 'Turma A',
        Escola: { nome: 'Escola 1' },
        Alunos: [],
        escola_id: 10,
        createdAt: '2024-01-10T00:00:00Z'
      }
    ];

    classServiceMock.getAllClasses.and.returnValue(of(mockData));

    component.getClasses();

    expect(component.classesList.length).toBe(1);
    expect(component.classesList[0].identificacao).toBe('Turma A');
    expect(component.classesList[0].escola?.nome).toBe('Escola 1');
  });

  // --------------------------------------------------------
  // getClasses (erro)
  // --------------------------------------------------------
  it('should show feedback error when getClasses fails', () => {
    const spyFeedback = spyOn<any>(component, 'mostrarFeedback');

    classServiceMock.getAllClasses.and.returnValue(throwError(() => new Error('fail')));

    component.getClasses();

    expect(spyFeedback).toHaveBeenCalledWith('Erro ao buscar turmas. Tente novamente.', 'error');
  });

  // --------------------------------------------------------
  // getInitials
  // --------------------------------------------------------
  it('should return initials correctly', () => {
    expect(component.getInitials('Joao Silva')).toBe('JS');
    expect(component.getInitials('Maria')).toBe('MA');
    expect(component.getInitials('')).toBe('');
  });

  // --------------------------------------------------------
  // addClass
  // --------------------------------------------------------
  it('should open dialog when adding class', () => {
    dialogMock.open.and.returnValue({
      afterClosed: () => of({ message: 'ok', type: 'success' })
    });

    const spy = spyOn(component, 'getClasses');

    component.addClass();

    expect(dialogMock.open).toHaveBeenCalledWith(ClassFormDialogComponent, { width: '560px' });
    expect(spy).toHaveBeenCalled();
  });

  // --------------------------------------------------------
  // editClass
  // --------------------------------------------------------
  it('should open dialog when editing class', () => {
    const mockTurma = { id: '1' } as Turma;

    dialogMock.open.and.returnValue({
      afterClosed: () => of({ message: 'updated', type: 'success' })
    });

    const spy = spyOn(component, 'getClasses');

    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.editClass(mockTurma, event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(dialogMock.open).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  // --------------------------------------------------------
  // deleteClass
  // --------------------------------------------------------
  it('should delete class successfully', () => {
    const mockTurma = { id: '1' } as Turma;

    classServiceMock.deleteClass.and.returnValue(of({ message: 'deleted' }));

    const spy = spyOn(component, 'getClasses');

    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.deleteClass(mockTurma, event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(classServiceMock.deleteClass).toHaveBeenCalledWith('1');
    expect(spy).toHaveBeenCalled();
  });

  // --------------------------------------------------------
  // deleteClass (erro)
  // --------------------------------------------------------
  it('should show feedback when delete fails', () => {
    const mockTurma = { id: '1' } as Turma;
    const spyFeedback = spyOn<any>(component, 'mostrarFeedback');

    classServiceMock.deleteClass.and.returnValue(throwError(() => new Error('fail')));

    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.deleteClass(mockTurma, event);

    expect(spyFeedback).toHaveBeenCalledWith('Erro ao deletar turma. Tente novamente.', 'error');
  });

  // --------------------------------------------------------
  // listHasClasses
  // --------------------------------------------------------
  it('should return true only if all classes have filtered=true', () => {
    component.classesList = [
      { id: '1', filtered: true } as Turma,
      { id: '2', filtered: true } as Turma
    ];

    expect(component.listHasClasses()).toBeTrue();

    component.classesList = [
      { id: '1', filtered: true } as Turma,
      { id: '2', filtered: false } as Turma
    ];

    expect(component.listHasClasses()).toBeFalse();
  });

  // --------------------------------------------------------
  // mostrarFeedback
  // --------------------------------------------------------
  it('should set feedback signals correctly', () => {
    component['mostrarFeedback']('ok', 'success');

    expect(component.feedbackMessage()).toBe('ok');
    expect(component.feedbackType()).toBe('success');
  });
});
