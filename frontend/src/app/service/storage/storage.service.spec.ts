import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  const TOKEN_KEY = 'access_token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });

    service = TestBed.inject(StorageService);

    sessionStorage.clear();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('getToken', () => {
    it('deve retornar o token quando existir no sessionStorage', () => {
      const expectedToken = '123456';
      sessionStorage.setItem(TOKEN_KEY, expectedToken);

      const result = service.getToken();

      expect(result).toBe(expectedToken);
    });

    it('deve retornar null quando o token não existir', () => {
      const result = service.getToken();

      expect(result).toBeNull();
    });
  });

});
