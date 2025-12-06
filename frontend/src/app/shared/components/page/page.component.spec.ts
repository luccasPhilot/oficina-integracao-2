import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../service/auth/auth.service';
import { FeedbackPopupComponent } from '../feedback-popup/feedback-popup.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { PageComponent } from './page.component';

class RouterMock {
    url = '/dashboard';
    navigate = jasmine.createSpy('navigate');
}

class HttpClientMock {
    post = jasmine.createSpy('post');
}

class AuthServiceMock {
    logout = jasmine.createSpy('logout');
}

describe('PageComponent', () => {
    let component: PageComponent;
    let fixture: ComponentFixture<PageComponent>;
    let router: RouterMock;
    let http: HttpClientMock;
    let authService: AuthServiceMock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageComponent, FeedbackPopupComponent, SearchBarComponent],
            providers: [
                { provide: Router, useClass: RouterMock },
                { provide: HttpClient, useClass: HttpClientMock },
                { provide: AuthService, useClass: AuthServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PageComponent);
        component = fixture.componentInstance;

        router = TestBed.inject(Router) as unknown as RouterMock;
        http = TestBed.inject(HttpClient) as unknown as HttpClientMock;
        authService = TestBed.inject(AuthService) as unknown as AuthServiceMock;

        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve retornar a rota atual (currentRoute)', () => {
        expect(component.currentRoute).toBe('/dashboard');
    });

    it('deve navegar para uma rota ao chamar navigateTo()', () => {
        component.navigateTo('/student-list');
        expect(router.navigate).toHaveBeenCalledWith(['/student-list']);
    });

    it('deve emitir addButtonClicked quando o botão de adicionar for clicado', () => {
        component.showAddButton = true;
        component.objectName = 'Aluno';

        fixture.detectChanges();

        spyOn(component.addButtonClicked, 'emit');

        const btn = fixture.debugElement.query(By.css('.default-button'));
        btn.triggerEventHandler('click');

        expect(component.addButtonClicked.emit).toHaveBeenCalled();
    });

    it('deve chamar logout com sucesso e mostrar feedback success', fakeAsync(() => {
        http.post.and.returnValue(of({}));

        component.logout();

        tick();

        expect(authService.logout).toHaveBeenCalled();
        expect(component.feedbackMessage).toBe('Logout realizado com sucesso!');
        expect(component.feedbackType).toBe('success');
    }));

    it('deve tratar erro no logout e mostrar feedback error', fakeAsync(() => {
        http.post.and.returnValue(throwError(() => ({ message: 'Erro' })));

        component.logout();

        tick();

        expect(authService.logout).toHaveBeenCalled();
        expect(component.feedbackType).toBe('error');
        expect(component.feedbackMessage).toContain('Não foi possível invalidar a sessão');
    }));

    it('deve renderizar a search bar quando showSearchBar=true', () => {
        component.showSearchBar = true;
        fixture.detectChanges();

        const searchBar = fixture.debugElement.query(By.directive(SearchBarComponent));
        expect(searchBar).toBeTruthy();
    });
});
