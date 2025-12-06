import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
    let guard: AuthGuard;
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
                AuthGuard,
                { provide: AuthService, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter }
            ]
        });

        guard = TestBed.inject(AuthGuard);
    });

    it('deve permitir navegação quando o usuário está autenticado', async () => {
        mockAuthService.isAuthenticated.and.returnValue(of(true));

        const result = await guard.canActivate();

        expect(result).toBeTrue();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('deve bloquear navegação e redirecionar para /login quando usuário NÃO está autenticado', async () => {
        mockAuthService.isAuthenticated.and.returnValue(of(false));

        const result = await guard.canActivate();

        expect(result).toBeFalse();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('deve redirecionar para /login caso ocorra erro na verificação', async () => {
        mockAuthService.isAuthenticated.and.returnValue(
            throwError(() => new Error('Erro interno'))
        );

        const result = await guard.canActivate();

        expect(result).toBeFalse();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
});
