import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';
import { LoginRedirectGuard } from './login-redirect.guard';

describe('LoginRedirectGuard', () => {
    let guard: LoginRedirectGuard;
    let mockAuthService: any;
    let mockRouter: any;

    beforeEach(() => {
        mockAuthService = {
            isAuthenticated: jasmine.createSpy('isAuthenticated')
        };

        mockRouter = {
            navigate: jasmine.createSpy('navigate')
        };

        TestBed.configureTestingModule({
            providers: [
                LoginRedirectGuard,
                { provide: AuthService, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter }
            ]
        });

        guard = TestBed.inject(LoginRedirectGuard);
    });

    it('deve permitir navegação quando o usuário NÃO está autenticado', async () => {
        mockAuthService.isAuthenticated.and.returnValue(of(false));

        const result = await guard.canActivate();

        expect(result).toBeTrue();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('deve bloquear navegação e redirecionar quando o usuário está autenticado', async () => {
        mockAuthService.isAuthenticated.and.returnValue(of(true));

        const result = await guard.canActivate();

        expect(result).toBeFalse();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('deve permitir navegação em caso de erro ao verificar autenticação', async () => {
        mockAuthService.isAuthenticated.and.returnValue(
            throwError(() => new Error('Erro interno'))
        );

        const result = await guard.canActivate();

        expect(result).toBeTrue();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
});
