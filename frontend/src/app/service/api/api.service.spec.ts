import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { StorageService } from '../storage/storage.service';
import { ApiService } from './api.service';

import { EndpointMark } from '../../shared/interfaces/endpoint-mark.interface';
import { HeaderType } from '../../shared/interfaces/enuns/header-type.enum';

describe('ApiService', () => {

  let service: ApiService;
  let httpMock: HttpTestingController;
  let storageService: jasmine.SpyObj<StorageService>;

  const mockToken = '123456';

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('StorageService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: StorageService, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ------------------------------------------------------------
  // getToken
  // ------------------------------------------------------------
  it('deve usar accessToken do StorageService quando disponível', () => {
    storageService.getToken.and.returnValue(mockToken);

    const token = service.getToken();

    expect(token).toBe(`Bearer ${mockToken}`);
  });

  it('deve usar TOKEN do environment quando StorageService retorna null', () => {
    storageService.getToken.and.returnValue(null);

    const token = service.getToken();

    expect(token.startsWith('Bearer ')).toBeTrue();
  });

  // ------------------------------------------------------------
  // GET
  // ------------------------------------------------------------
  it('deve fazer chamada GET com URL completa e headers corretos', () => {
    storageService.getToken.and.returnValue(mockToken);

    const marks: EndpointMark[] = [
      { name: '#id#', value: 10 }
    ];

    service.get('base/', 'item/#id#', marks).subscribe();

    const req = httpMock.expectOne('base/item/10');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
  });

  // ------------------------------------------------------------
  // POST
  // ------------------------------------------------------------
  it('deve fazer chamada POST com body e headers', () => {
    storageService.getToken.and.returnValue(mockToken);

    service.post('url/', 'create', { name: 'Test' }).subscribe();

    const req = httpMock.expectOne('url/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Test' });
  });

  // ------------------------------------------------------------
  // PATCH
  // ------------------------------------------------------------
  it('deve fazer chamada PATCH', () => {
    storageService.getToken.and.returnValue(mockToken);

    service.patch('url/', 'edit', { x: 1 }).subscribe();

    const req = httpMock.expectOne('url/edit');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ x: 1 });
  });

  // ------------------------------------------------------------
  // PUT
  // ------------------------------------------------------------
  it('deve fazer chamada PUT', () => {
    storageService.getToken.and.returnValue(mockToken);

    service.put('url/', 'update', { foo: 'bar' }).subscribe();

    const req = httpMock.expectOne('url/update');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ foo: 'bar' });
  });

  // ------------------------------------------------------------
  // DELETE
  // ------------------------------------------------------------
  it('deve fazer chamada DELETE com body e headers', () => {
    storageService.getToken.and.returnValue(mockToken);

    service.delete('url/', 'remove', { id: 10 }).subscribe();

    const req = httpMock.expectOne('url/remove');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual({ id: 10 });
  });

  // ------------------------------------------------------------
  // Headers
  // ------------------------------------------------------------
  it('deve adicionar headers corretamente conforme HeaderType', () => {
    storageService.getToken.and.returnValue(mockToken);

    service.get('url/', 'test', [], [
      HeaderType.CONTENT_JSON,
      HeaderType.ACCEPT_JSON,
      HeaderType.CORS
    ]).subscribe();

    const req = httpMock.expectOne('url/test');

    expect(req.request.headers.get('content-type')).toBe('application/json');
    expect(req.request.headers.get('accept')).toBe('application/json');
    expect(req.request.headers.get('access-control-allow-origin')).toBe('*');
  });

  // ------------------------------------------------------------
  // getFullUrl e substituição de marks
  // ------------------------------------------------------------
  it('deve substituir marks corretamente na URL', () => {
    const marks: EndpointMark[] = [
      { name: '#a#', value: '123' },
      { name: '#b#', value: 'XYZ' }
    ];

    storageService.getToken.and.returnValue(mockToken);

    service.get('api/', 'search/#a#/#b#', marks).subscribe();
    const req = httpMock.expectOne('api/search/123/XYZ');

    expect(req.request.method).toBe('GET');
  });

});
