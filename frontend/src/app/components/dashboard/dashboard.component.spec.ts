import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { of, throwError } from 'rxjs';
import { ClassService } from '../../service/class/class.service';
import { RepresentativeService } from '../../service/representative/representative.service';
import { SchoolService } from '../../service/school/school.service';
import { StudentService } from '../../service/student/student.service';
import { FeedbackPopupComponent } from '../../shared/components/feedback-popup/feedback-popup.component';
import { PageComponent } from '../../shared/components/page/page.component';
import { DashboardComponent } from './dashboard.component';
import { provideRouter } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;

  let classServiceMock: jasmine.SpyObj<ClassService>;
  let schoolServiceMock: jasmine.SpyObj<SchoolService>;
  let representativeServiceMock: jasmine.SpyObj<RepresentativeService>;
  let studentServiceMock: jasmine.SpyObj<StudentService>;

  beforeEach(async () => {
    classServiceMock = jasmine.createSpyObj('ClassService', ['getAllClasses']);
    schoolServiceMock = jasmine.createSpyObj('SchoolService', ['getAllSchools']);
    representativeServiceMock = jasmine.createSpyObj('RepresentativeService', ['getAllRepresentatives']);
    studentServiceMock = jasmine.createSpyObj('StudentService', ['getAllStudents']);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        PageComponent,
        FeedbackPopupComponent,
        MatIconModule,
        HttpClientTestingModule
      ],
      providers: [
        provideRouter([]),
        { provide: ClassService, useValue: classServiceMock },
        { provide: SchoolService, useValue: schoolServiceMock },
        { provide: RepresentativeService, useValue: representativeServiceMock },
        { provide: StudentService, useValue: studentServiceMock }
      ]
    }).compileComponents();

    component = TestBed.createComponent(DashboardComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call all fetch methods on init', () => {
    spyOn(component, 'getClasses');
    spyOn(component, 'getSchools');
    spyOn(component, 'getRepresentatives');
    spyOn(component, 'getStudents');

    component.ngOnInit();

    expect(component.getClasses).toHaveBeenCalled();
    expect(component.getSchools).toHaveBeenCalled();
    expect(component.getRepresentatives).toHaveBeenCalled();
    expect(component.getStudents).toHaveBeenCalled();
  });

  it('should load classes successfully', () => {
    const mockData = [{ id: 1, nome: 'Turma A' }] as any;
    classServiceMock.getAllClasses.and.returnValue(of(mockData));

    component.getClasses();

    expect(component.classesList).toEqual(mockData);
  });

  it('should show feedback on getClasses error', () => {
    spyOn(console, 'error');
    classServiceMock.getAllClasses.and.returnValue(throwError(() => new Error('Error')));
    const feedbackSpy = spyOn<any>(component, 'mostrarFeedback');

    component.getClasses();

    expect(feedbackSpy).toHaveBeenCalledWith('Erro ao buscar turmas. Tente novamente.', 'error');
  });

  it('should load schools successfully', () => {
    const mockData = [{ id: 10, nome: 'Escola XPTO' }] as any;
    schoolServiceMock.getAllSchools.and.returnValue(of(mockData));

    component.getSchools();

    expect(component.schoolsList).toEqual(mockData);
  });

  it('should show feedback on getSchools error', () => {
    spyOn(console, 'error');
    schoolServiceMock.getAllSchools.and.returnValue(throwError(() => new Error('Error')));
    const feedbackSpy = spyOn<any>(component, 'mostrarFeedback');

    component.getSchools();

    expect(feedbackSpy).toHaveBeenCalledWith('Erro ao buscar escolas. Tente novamente.', 'error');
  });

  it('should load students successfully', () => {
    const mockData = [{ id: 5, nome: 'Maria' }] as any;
    studentServiceMock.getAllStudents.and.returnValue(of(mockData));

    component.getStudents();

    expect(component.studentList).toEqual(mockData);
  });

  it('should show feedback on getStudents error', () => {
    spyOn(console, 'error');
    studentServiceMock.getAllStudents.and.returnValue(throwError(() => new Error('Error')));
    const feedbackSpy = spyOn<any>(component, 'mostrarFeedback');

    component.getStudents();

    expect(feedbackSpy).toHaveBeenCalledWith('Erro ao buscar alunos. Tente novamente.', 'error');
  });

  it('should update feedbackMessage and feedbackType', () => {
    component['mostrarFeedback']('Mensagem OK', 'success');

    expect(component.feedbackMessage()).toBe('Mensagem OK');
    expect(component.feedbackType()).toBe('success');
  });
});
