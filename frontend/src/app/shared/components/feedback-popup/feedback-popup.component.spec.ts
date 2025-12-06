import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FeedbackPopupComponent } from './feedback-popup.component';

describe('FeedbackPopupComponent', () => {
    let component: FeedbackPopupComponent;
    let fixture: ComponentFixture<FeedbackPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeedbackPopupComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(FeedbackPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve exibir o popup quando a mensagem mudar', () => {
        component.message = 'Operação realizada com sucesso';
        component.ngOnChanges({
            message: {
                currentValue: component.message,
                previousValue: '',
                firstChange: false,
                isFirstChange: () => false
            }
        });

        fixture.detectChanges();

        const popup = fixture.debugElement.query(By.css('.feedback-popup'));
        expect(popup).toBeTruthy();
        expect(component.isVisible).toBeTrue();
    });

    it('deve esconder automaticamente após 3 segundos', fakeAsync(() => {
        component.message = 'Mensagem temporária';
        component.ngOnChanges({
            message: {
                currentValue: component.message,
                previousValue: '',
                firstChange: false,
                isFirstChange: () => false
            }
        });

        fixture.detectChanges();
        expect(component.isVisible).toBeTrue();

        tick(3000); // avança o tempo
        fixture.detectChanges();

        expect(component.isVisible).toBeFalse();

        const popup = fixture.debugElement.query(By.css('.feedback-popup'));
        expect(popup).toBeNull(); // não deve estar no DOM
    }));

    it('deve aplicar a classe "feedback-success" quando type="success"', () => {
        component.message = 'Tudo certo';
        component.type = 'success';

        component.ngOnChanges({
            message: {
                currentValue: component.message,
                previousValue: '',
                firstChange: false,
                isFirstChange: () => false
            }
        });

        fixture.detectChanges();

        const popup = fixture.debugElement.query(By.css('.feedback-popup')).nativeElement;
        expect(popup.classList).toContain('feedback-success');
        expect(popup.classList).not.toContain('feedback-error');
    });

    it('deve aplicar a classe "feedback-error" quando type="error"', () => {
        component.message = 'Algo deu errado';
        component.type = 'error';

        component.ngOnChanges({
            message: {
                currentValue: component.message,
                previousValue: '',
                firstChange: false,
                isFirstChange: () => false
            }
        });

        fixture.detectChanges();

        const popup = fixture.debugElement.query(By.css('.feedback-popup')).nativeElement;
        expect(popup.classList).toContain('feedback-error');
        expect(popup.classList).not.toContain('feedback-success');
    });

    it('não deve exibir popup se message estiver vazio', () => {
        component.message = '';
        component.ngOnChanges({
            message: {
                currentValue: '',
                previousValue: '',
                firstChange: false,
                isFirstChange: () => false
            }
        });

        fixture.detectChanges();

        expect(component.isVisible).toBeFalse();
        const popup = fixture.debugElement.query(By.css('.feedback-popup'));
        expect(popup).toBeNull();
    });
});
