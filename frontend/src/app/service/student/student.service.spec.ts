import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Aluno } from '../../shared/interfaces/aluno.interface';
import { ApiService } from '../api/api.service';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const URL = `${environment.apiUrl}/`;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'post',
      'get',
      'put',
      'delete'
    ]);

    TestBed.configureTestingModule({
      providers: [
        StudentService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(StudentService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('addStudent', () => {
    it('deve chamar ApiService.post corretamente', () => {
      const mockRequest: Aluno = {
        id: '1',
        nome: 'Aluno Teste',
        idade: 10,
        turmaId: 'A1'
      } as any;

      apiServiceSpy.post.and.returnValue(of({ success: true }));

      service.addStudent(mockRequest).subscribe(response => {
        expect(response).toEqual({ success: true });
      });

      expect(apiServiceSpy.post).toHaveBeenCalledWith(
        URL,
        'aluno',
        mockRequest,
        undefined,
        undefined,
        { withCredentials: true }
      );
    });
  });

  describe('getStudent', () => {
    it('deve chamar ApiService.get corretamente', () => {
      const mockResponse = { id: '1', nome: 'Aluno Teste' };
      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getStudent('1').subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith(
        URL,
        'aluno/id',
        [{ name: 'id', value: '1' }],
        undefined,
        { withCredentials: true }
      );
    });
  });

  describe('getAllStudents', () => {
    it('deve chamar ApiService.get corretamente', () => {
      const mockResponse = [{ id: '1', nome: 'Aluno Teste' }];
      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getAllStudents().subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith(
        URL,
        'aluno',
        undefined,
        undefined,
        { withCredentials: true }
      );
    });
  });

  describe('updateStudent', () => {
    it('deve chamar ApiService.put corretamente', () => {
      const mockRequest: Aluno = {
        id: '1',
        nome: 'Novo Nome',
        idade: 11,
        turmaId: 'A1'
      } as any;

      apiServiceSpy.put.and.returnValue(of({ updated: true }));

      service.updateStudent('1', mockRequest).subscribe(result => {
        expect(result).toEqual({ updated: true });
      });

      expect(apiServiceSpy.put).toHaveBeenCalledWith(
        URL,
        'aluno/id',
        mockRequest,
        [{ name: 'id', value: '1' }]
      );
    });
  });

  describe('deleteStudent', () => {
    it('deve chamar ApiService.delete corretamente', () => {
      apiServiceSpy.delete.and.returnValue(of({ deleted: true }));

      service.deleteStudent('1').subscribe(result => {
        expect(result).toEqual({ deleted: true });
      });

      expect(apiServiceSpy.delete).toHaveBeenCalledWith(
        URL,
        'aluno/id',
        {},
        [{ name: 'id', value: '1' }]
      );
    });
  });

});
