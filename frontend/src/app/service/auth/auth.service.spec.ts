import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { AuthService } from './auth.service';

import { environment } from '../../environments/environment';
import { ENDPOINTS } from '../../shared/interfaces/endpoints/endpoints-auth.interface';

describe('AuthService', () => {

  let service: AuthService;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;

  const mockUrl = `${environment.apiUrl}/`;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['get', 'post']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  // -------------------------------------------------------------------
  // login()
  // -------------------------------------------------------------------
  it('deve chamar ApiService.post para login e retornar o observable', () => {
    const mockRequest = { user: 'john', password: '123' };
    const mockResponse = { token: 'abc' };

    apiService.post.and.returnValue(of(mockResponse));

    service.login(mockRequest).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.post).toHaveBeenCalledWith(
      mockUrl,
      ENDPOINTS.login,
      mockRequest,
      undefined,
      undefined,
      { withCredentials: true }
    );
  });

  // -------------------------------------------------------------------
  // logout()
  // -------------------------------------------------------------------
  it('deve chamar logout e navegar para /login quando sucesso', () => {
    apiService.post.and.returnValue(of({ success: true }));

    service.logout();

    expect(apiService.post).toHaveBeenCalledWith(
      mockUrl,
      ENDPOINTS.logout,
      {},
      undefined,
      undefined,
      { withCredentials: true }
    );

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve chamar logout e navegar para /login mesmo se falhar', () => {
    apiService.post.and.returnValue(throwError(() => new Error('API error')));

    service.logout();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // -------------------------------------------------------------------
  // isAuthenticated()
  // -------------------------------------------------------------------
  it('deve retornar TRUE quando API retorna { isValid: true }', () => {
    apiService.get.and.returnValue(of({ isValid: true }));

    service.isAuthenticated().subscribe(isValid => {
      expect(isValid).toBeTrue();
    });

    expect(apiService.get).toHaveBeenCalledWith(
      mockUrl,
      ENDPOINTS.validate,
      undefined,
      undefined,
      { withCredentials: true }
    );
  });

  it('deve retornar FALSE quando API retorna { isValid: false }', () => {
    apiService.get.and.returnValue(of({ isValid: false }));

    service.isAuthenticated().subscribe(isValid => {
      expect(isValid).toBeFalse();
    });
  });

  it('deve retornar FALSE quando API retorna objeto sem isValid', () => {
    apiService.get.and.returnValue(of({}));

    service.isAuthenticated().subscribe(isValid => {
      expect(isValid).toBeFalse();
    });
  });

  it('deve retornar FALSE quando API falhar', () => {
    apiService.get.and.returnValue(throwError(() => new Error('API error')));

    service.isAuthenticated().subscribe(isValid => {
      expect(isValid).toBeFalse();
    });
  });

});
