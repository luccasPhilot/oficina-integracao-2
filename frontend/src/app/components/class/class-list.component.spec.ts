import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ClassService } from '../../service/class/class.service';
import { Turma } from '../../shared/interfaces/turma.interface';
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

  it('should call getClasses on init', () => {
    classServiceMock.getAllClasses.and.returnValue(of([]));
    const spy = spyOn(component, 'getClasses').and.callThrough();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should load class list correctly (branch escola/escola)', () => {
    const mockData = [
      {
        id: 1,
        identificacao: 'Turma A',
        Escola: { nome: 'Escola X' },
        Alunos: [{ nome: 'Aluno 1', idade: 10 }],
        escola_id: 10,
        createdAt: '2024-01-10T00:00:00Z'
      }
    ];

    classServiceMock.getAllClasses.and.returnValue(of(mockData));
    component.getClasses();

    expect(component.classesList.length).toBe(1);
    expect(component.classesList[0].escola?.nome).toBe('Escola X');
    expect(component.classesList[0].alunos?.length).toBe(1);
  });

  it('should load class list correctly (branch escola lowercase, alunos lowercase)', () => {
    const mockData = [
      {
        id: 2,
        identificacao: 'Turma B',
        escola: { nome: 'Escola Y' },
        alunos: [{ nome: 'Aluno 2', idade: 11 }],
        escola_id: 20,
        createdAt: '2024-01-11T00:00:00Z'
      }
    ];

    classServiceMock.getAllClasses.and.returnValue(of(mockData));
    component.getClasses();

    expect(component.classesList[0].escola?.nome).toBe('Escola Y');
    expect(component.classesList[0].alunos?.length).toBe(1);
  });

  it('should load class list correctly when escolas are undefined and default {} is applied', () => {
    const mockData = [
      {
        id: 3,
        identificacao: 'Sem Escola',
        Escola: null,
        escola: null,
        Alunos: null,
        alunos: null,
        escola_id: 30,
        createdAt: '2024-01-12T00:00:00Z'
      }
    ];

    classServiceMock.getAllClasses.and.returnValue(of(mockData));
    component.getClasses();

    expect(component.classesList[0].escola).toEqual(jasmine.any(Object));
    expect(Object.keys(component.classesList[0].escola ?? {}).length).toBe(0);
    expect(component.classesList[0].alunos?.length).toBe(0);
  });

  it('should show feedback error when getClasses fails', () => {
    const spyFeedback = spyOn<any>(component, 'mostrarFeedback');
    classServiceMock.getAllClasses.and.returnValue(throwError(() => new Error('fail')));

    component.getClasses();

    expect(spyFeedback).toHaveBeenCalledWith('Erro ao buscar turmas. Tente novamente.', 'error');
  });

  it('should return initials correctly', () => {
    expect(component.getInitials('Joao Silva')).toBe('JS');
    expect(component.getInitials('Maria')).toBe('MA');
    expect(component.getInitials('')).toBe('');
  });

  it('should open dialog when adding class (result null branch)', () => {
    dialogMock.open.and.returnValue({ afterClosed: () => of(null) });
    const spy = spyOn(component, 'getClasses');
    component.addClass();
    expect(dialogMock.open).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should open dialog when adding class (result truthy branch)', () => {
    dialogMock.open.and.returnValue({ afterClosed: () => of({ message: 'ok', type: 'success' }) });
    const spy = spyOn(component, 'getClasses');

    component.addClass();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('should open dialog when editing class (result null branch)', () => {
    const turma = { id: '1' } as Turma;
    dialogMock.open.and.returnValue({ afterClosed: () => of(null) });
    const spy = spyOn(component, 'getClasses');

    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.editClass(turma, event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should open dialog when editing class (result truthy branch)', () => {
    const turma = { id: '1' } as Turma;
    dialogMock.open.and.returnValue({ afterClosed: () => of({ message: 'updated', type: 'success' }) });
    const spy = spyOn(component, 'getClasses');

    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.editClass(turma, event);

    expect(spy).toHaveBeenCalled();
  });

  it('should delete class successfully', () => {
    const turma = { id: '1' } as Turma;
    classServiceMock.deleteClass.and.returnValue(of({ message: 'deleted' }));

    const spy = spyOn(component, 'getClasses');
    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.deleteClass(turma, event);

    expect(classServiceMock.deleteClass).toHaveBeenCalledWith('1');
    expect(spy).toHaveBeenCalled();
  });

  it('should show feedback when delete fails', () => {
    const turma = { id: '1' } as Turma;
    const spyFeedback = spyOn<any>(component, 'mostrarFeedback');

    classServiceMock.deleteClass.and.returnValue(throwError(() => new Error('fail')));

    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.deleteClass(turma, event);

    expect(spyFeedback).toHaveBeenCalledWith('Erro ao deletar turma. Tente novamente.', 'error');
  });

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

  it('should return false when list is empty (branch)', () => {
    component.classesList = [];
    expect(component.listHasClasses()).toBeTrue();
  });

  it('should set feedback signals correctly', () => {
    component['mostrarFeedback']('ok', 'success');
    expect(component.feedbackMessage()).toBe('ok');
    expect(component.feedbackType()).toBe('success');
  });

  it('should call editStudent without error', () => {
    expect(() => component.editStudent()).not.toThrow();
  });

  it('should call deleteStudent without error', () => {
    expect(() => component.deleteStudent()).not.toThrow();
  });
});
