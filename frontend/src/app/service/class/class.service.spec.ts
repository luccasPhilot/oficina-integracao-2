import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { environment } from '../../environments/environment';
import { Turma } from '../../shared/interfaces/turma.interface';
import { ApiService } from '../api/api.service';
import { ClassService } from './class.service';

describe('ClassService', () => {
  let service: ClassService;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockUrl = `${environment.apiUrl}/`;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        ClassService,
        { provide: ApiService, useValue: apiSpy }
      ]
    });

    service = TestBed.inject(ClassService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  // -------------------------------------------------------------------
  // addClass()
  // -------------------------------------------------------------------
  it('deve chamar addClass corretamente', () => {
    const request: Turma = { id: '999', identificacao: 'Turma A', escola_id: 'escola1' };
    const mockResponse = { success: true };

    apiService.post.and.returnValue(of(mockResponse));

    service.addClass(request).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.post).toHaveBeenCalledWith(
      mockUrl,
      'turma',
      request,
      undefined,
      undefined,
      { withCredentials: true }
    );
  });

  // -------------------------------------------------------------------
  // getClass()
  // -------------------------------------------------------------------
  it('deve chamar getClass com id correto', () => {
    const mockResponse = { id: '123', nome: 'Turma X' };

    apiService.get.and.returnValue(of(mockResponse));

    service.getClass('123').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.get).toHaveBeenCalledWith(
      mockUrl,
      'turma/id',
      [{ name: 'id', value: '123' }],
      undefined,
      { withCredentials: true }
    );
  });

  // -------------------------------------------------------------------
  // getAllClasses()
  // -------------------------------------------------------------------
  it('deve chamar getAllClasses corretamente', () => {
    const mockResponse = [{ id: '1' }, { id: '2' }];

    apiService.get.and.returnValue(of(mockResponse));

    service.getAllClasses().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.get).toHaveBeenCalledWith(
      mockUrl,
      'turma',
      undefined,
      undefined,
      { withCredentials: true }
    );
  });

  // -------------------------------------------------------------------
  // updateClass()
  // -------------------------------------------------------------------
  it('deve chamar updateClass com params corretos', () => {
    const request: Turma = { id: '999', identificacao: 'Atualizada', escola_id: 'escola1' };
    const mockResponse = { updated: true };

    apiService.put.and.returnValue(of(mockResponse));

    service.updateClass('999', request).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.put).toHaveBeenCalledWith(
      mockUrl,
      'turma/id',
      request,
      [{ name: 'id', value: '999' }]
    );
  });

  // -------------------------------------------------------------------
  // deleteClass()
  // -------------------------------------------------------------------
  it('deve chamar deleteClass com params corretos', () => {
    const mockResponse = { deleted: true };

    apiService.delete.and.returnValue(of(mockResponse));

    service.deleteClass('888').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.delete).toHaveBeenCalledWith(
      mockUrl,
      'turma/id',
      {},
      [{ name: 'id', value: '888' }]
    );
  });

});
