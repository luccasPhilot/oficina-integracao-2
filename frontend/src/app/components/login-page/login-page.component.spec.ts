import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';
import { FeedbackPopupComponent } from '../../shared/components/feedback-popup/feedback-popup.component';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
    let component: LoginPageComponent;
    let fixture: any;


    let authServiceMock: jasmine.SpyObj<AuthService>;
    let routerMock: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
        routerMock = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [
                LoginPageComponent,
                CommonModule,
                ReactiveFormsModule,
                FormsModule,
                FeedbackPopupComponent,
                HttpClientTestingModule
            ],
        })
            .overrideProvider(AuthService, { useValue: authServiceMock })
            .overrideProvider(Router, { useValue: routerMock })
            .compileComponents();

        fixture = TestBed.createComponent(LoginPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should mark form as touched and not submit if invalid', () => {
        spyOn(component.loginForm, 'markAllAsTouched');

        component.onSubmit();

        expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
        expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('should call login and navigate on success', fakeAsync(() => {
        component.loginForm.setValue({ id: 'john', password: '123' });

        authServiceMock.login.and.returnValue(
            of({ message: 'Logged!', type: 'success' })
        );

        component.onSubmit();
        fixture.detectChanges();
        tick();

        expect(authServiceMock.login).toHaveBeenCalledWith({
            user: 'john',
            password: '123'
        });

        expect(component.feedbackMessage()).toBe('Logged!');
        expect(component.feedbackType()).toBe('success');
        expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
        expect(component.isLoading()).toBe(false);
    }));

    it('should show error feedback on failed login', fakeAsync(() => {
        component.loginForm.setValue({ id: 'john', password: '123' });

        authServiceMock.login.and.returnValue(
            throwError(() => ({ error: { message: 'Credenciais incorretas' } }))
        );

        component.onSubmit();
        fixture.detectChanges();
        tick();

        expect(component.feedbackMessage()).toBe('Credenciais incorretas');
        expect(component.feedbackType()).toBe('error');
        expect(routerMock.navigate).not.toHaveBeenCalled();
        expect(component.isLoading()).toBe(false);
    }));

    it('should fallback to default error message if server sends no message', fakeAsync(() => {
        component.loginForm.setValue({ id: 'john', password: '123' });

        authServiceMock.login.and.returnValue(throwError(() => ({})));

        component.onSubmit();
        fixture.detectChanges();
        tick();

        expect(component.feedbackMessage()).toBe('Erro ao tentar login. Tente novamente.');
        expect(component.feedbackType()).toBe('error');
    }));

    it('should update feedback signals using mostrarFeedback', () => {
        (component as any).mostrarFeedback('Ok', 'success');
        fixture.detectChanges();

        expect(component.feedbackMessage()).toBe('Ok');
        expect(component.feedbackType()).toBe('success');
    });

    it('should set loading true at submit, false after finalize', fakeAsync(() => {
        component.loginForm.setValue({ id: 'john', password: '123' });

        authServiceMock.login.and.returnValue(of({}));

        expect(component.isLoading()).toBe(false);

        component.onSubmit();
        fixture.detectChanges();
        expect(component.isLoading()).toBe(false);

        tick();
        fixture.detectChanges();
        expect(component.isLoading()).toBe(false);
    }));

    it('should disable button when form invalid or loading', fakeAsync(() => {
        const el = fixture.nativeElement as HTMLElement;
        const button = el.querySelector('button') as HTMLButtonElement;

        fixture.detectChanges();

        expect(button.disabled).toBeTrue();

        component.loginForm.setValue({ id: 'abc', password: '123' });
        fixture.detectChanges();
        tick();
        expect(button.disabled).toBeFalse();

        component.isLoading.set(true);
        fixture.detectChanges();
        expect(button.disabled).toBeTrue();

        component.isLoading.set(false);
        fixture.detectChanges();
        expect(button.disabled).toBeFalse();
    }));
});
