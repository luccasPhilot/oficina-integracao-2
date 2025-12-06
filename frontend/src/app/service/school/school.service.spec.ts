import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Escola } from '../../shared/interfaces/escola.interface';
import { ApiService } from '../api/api.service';
import { SchoolService } from './school.service';

describe('SchoolService', () => {
  let service: SchoolService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const URL = `${environment.apiUrl}/`;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<ApiService>('ApiService', [
      'post',
      'get',
      'put',
      'delete'
    ]);

    TestBed.configureTestingModule({
      providers: [
        SchoolService,
        { provide: ApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(SchoolService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('addSchool', () => {
    it('deve chamar apiService.post com os parâmetros corretos', () => {
      const mockRequest: Escola = { id: '1', nome: 'Escola Teste' } as Escola;
      const mockResponse = { success: true };
      apiServiceSpy.post.and.returnValue(of(mockResponse));

      service.addSchool(mockRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiServiceSpy.post).toHaveBeenCalledWith(
        URL,
        'escola',
        mockRequest,
        undefined,
        undefined,
        { withCredentials: true }
      );
    });
  });

  describe('getSchool', () => {
    it('deve chamar apiService.get com os parâmetros corretos', () => {
      const mockId = '10';
      const mockResponse = { id: mockId };
      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getSchool(mockId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith(
        URL,
        'escola/id',
        [{ name: 'id', value: mockId }],
        undefined,
        { withCredentials: true }
      );
    });
  });

  describe('getAllSchools', () => {
    it('deve chamar apiService.get sem filtros', () => {
      const mockResponse = [{ id: '1' }];
      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getAllSchools().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith(
        URL,
        'escola',
        undefined,
        undefined,
        { withCredentials: true }
      );
    });
  });

  describe('updateSchool', () => {
    it('deve chamar apiService.put com os parâmetros corretos', () => {
      const mockId = '5';
      const mockRequest: Escola = { id: mockId, nome: 'Atualizada' } as Escola;
      const mockResponse = { updated: true };
      apiServiceSpy.put.and.returnValue(of(mockResponse));

      service.updateSchool(mockId, mockRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiServiceSpy.put).toHaveBeenCalledWith(
        URL,
        'escola/id',
        mockRequest,
        [{ name: 'id', value: mockId }]
      );
    });
  });

  describe('deleteSchool', () => {
    it('deve chamar apiService.delete com os parâmetros corretos', () => {
      const mockId = '20';
      const mockResponse = { deleted: true };
      apiServiceSpy.delete.and.returnValue(of(mockResponse));

      service.deleteSchool(mockId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiServiceSpy.delete).toHaveBeenCalledWith(
        URL,
        'escola/id',
        {},
        [{ name: 'id', value: mockId }]
      );
    });
  });
});
