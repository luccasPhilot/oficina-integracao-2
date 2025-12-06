import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { environment } from '../../environments/environment';
import { Representante } from '../../shared/interfaces/representante.interface';
import { ApiService } from '../api/api.service';
import { RepresentativeService } from './representative.service';

describe('RepresentativeService', () => {
  let service: RepresentativeService;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockUrl = `${environment.apiUrl}/`;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        RepresentativeService,
        { provide: ApiService, useValue: apiSpy }
      ]
    });

    service = TestBed.inject(RepresentativeService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  // -------------------------------------------------------------------
  // addRepresentative()
  // -------------------------------------------------------------------
  it('deve chamar addRepresentative corretamente', () => {
    const request: Representante = { nome: 'João' } as Representante;
    const mockResponse = { success: true };

    apiService.post.and.returnValue(of(mockResponse));

    service.addRepresentative(request).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.post).toHaveBeenCalledWith(
      mockUrl,
      'representante',
      request,
      undefined,
      undefined,
      { withCredentials: true }
    );
  });

  // -------------------------------------------------------------------
  // getRepresentative()
  // -------------------------------------------------------------------
  it('deve chamar getRepresentative com id correto', () => {
    const mockResponse = { id: '10', nome: 'Maria' };

    apiService.get.and.returnValue(of(mockResponse));

    service.getRepresentative('10').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.get).toHaveBeenCalledWith(
      mockUrl,
      'representante/id',
      [{ name: 'id', value: '10' }],
      undefined,
      { withCredentials: true }
    );
  });

  // -------------------------------------------------------------------
  // getAllRepresentatives()
  // -------------------------------------------------------------------
  it('deve chamar getAllRepresentatives corretamente', () => {
    const mockResponse = [{ id: '1' }, { id: '2' }];

    apiService.get.and.returnValue(of(mockResponse));

    service.getAllRepresentatives().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.get).toHaveBeenCalledWith(
      mockUrl,
      'representante',
      undefined,
      undefined,
      { withCredentials: true }
    );
  });

  // -------------------------------------------------------------------
  // updateRepresentative()
  // -------------------------------------------------------------------
  it('deve chamar updateRepresentative com params corretos', () => {
    const request: Representante = { nome: 'Atualizado' } as Representante;
    const mockResponse = { updated: true };

    apiService.put.and.returnValue(of(mockResponse));

    service.updateRepresentative('55', request).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.put).toHaveBeenCalledWith(
      mockUrl,
      'representante/id',
      request,
      [{ name: 'id', value: '55' }]
    );
  });

  // -------------------------------------------------------------------
  // deleteRepresentative()
  // -------------------------------------------------------------------
  it('deve chamar deleteRepresentative com params corretos', () => {
    const mockResponse = { deleted: true };

    apiService.delete.and.returnValue(of(mockResponse));

    service.deleteRepresentative('33').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.delete).toHaveBeenCalledWith(
      mockUrl,
      'representante/id',
      {},
      [{ name: 'id', value: '33' }]
    );
  });

});
