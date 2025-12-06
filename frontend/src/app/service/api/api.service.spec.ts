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

  it('deve usar token do storage quando existir', () => {
    storageService.getToken.and.returnValue(mockToken);
    expect(service.getToken()).toBe(`Bearer ${mockToken}`);
  });

  it('deve usar TOKEN local quando storage retornar null', () => {
    storageService.getToken.and.returnValue(null);
    const token = service.getToken();
    expect(token.startsWith('Bearer ')).toBeTrue();
  });

  it('deve retornar URL sem marks quando marks não forem fornecidos', () => {
    storageService.getToken.and.returnValue(mockToken);

    service.get('base/', 'endpoint').subscribe();
    const req = httpMock.expectOne('base/endpoint');

    expect(req.request.method).toBe('GET');
  });

  it('deve montar URL com marks corretamente', () => {
    storageService.getToken.and.returnValue(mockToken);

    const marks: EndpointMark[] = [
      { name: '#id#', value: 5 },
      { name: '#type#', value: 'X' }
    ];

    service.get('api/', 'item/#id#/#type#', marks).subscribe();
    const req = httpMock.expectOne('api/item/5/X');

    expect(req.request.method).toBe('GET');
  });

  it('deve testar todos os headers do switch', () => {
    storageService.getToken.and.returnValue(mockToken);

    const headersToTest = [
      HeaderType.CONTENT_JSON,
      HeaderType.CONTENT_MULTIPART,
      HeaderType.ACCEPT_JSON,
      HeaderType.CORS,
      HeaderType.ALLOW_ALL_METHODS,
      HeaderType.ALLOW_COMMON_METHODS
    ];

    service.get('url/', 'headers', [], headersToTest).subscribe();

    const req = httpMock.expectOne('url/headers');
    const h = req.request.headers;

    expect(h.get('content-type')).toBe('application/json');
    expect(h.get('accept')).toBe('application/json');
    expect(h.get('access-control-allow-origin')).toBe('*');
    expect(h.get('access-control-allow-methods')).toBe('GET, POST, PATCH, PUT, DELETE, OPTIONS');
  });


  it('deve fazer POST com body e options extras', () => {
    storageService.getToken.and.returnValue(mockToken);

    service.post('url/', 'create', { x: 1 }, [], [], { reportProgress: true }).subscribe();

    const req = httpMock.expectOne('url/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ x: 1 });
    expect(req.request.reportProgress).toBeTrue();
  });

  it('deve fazer PATCH com body', () => {
    storageService.getToken.and.returnValue(mockToken);

    service.patch('url/', 'edit', { a: 10 }).subscribe();

    const req = httpMock.expectOne('url/edit');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ a: 10 });
  });

  it('deve fazer PUT com body', () => {
    storageService.getToken.and.returnValue(mockToken);

    service.put('url/', 'update', { data: 123 }).subscribe();

    const req = httpMock.expectOne('url/update');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ data: 123 });
  });

  it('deve fazer DELETE com body', () => {
    storageService.getToken.and.returnValue(mockToken);

    service.delete('url/', 'remove', { id: 1 }).subscribe();

    const req = httpMock.expectOne('url/remove');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual({ id: 1 });
  });

});
