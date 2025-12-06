import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;

  const mockData = { message: 'Tem certeza?' };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ConfirmationDialogComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar a mensagem corretamente', () => {
    const messageEl = fixture.debugElement.query(By.css('mat-dialog-content p')).nativeElement;
    expect(messageEl.textContent.trim()).toBe('Tem certeza?');
  });

  it('deve fechar o diálogo ao clicar no botão de fechar (X)', () => {
    const closeBtn = fixture.debugElement.query(By.css('.close-button'));
    closeBtn.triggerEventHandler('click', null);

    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('deve fechar o diálogo ao clicar no botão "Não"', () => {
    const cancelBtn = fixture.debugElement.query(By.css('.cancel-button'));
    cancelBtn.triggerEventHandler('click', null);

    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('deve ter o botão "Sim" com mat-dialog-close="true"', () => {
    const confirmBtn = fixture.debugElement.query(By.css('.confirm-button'));

    // Verificar se o atributo mat-dialog-close é true
    const hasCloseAttr = confirmBtn.attributes['mat-dialog-close'];

    expect(hasCloseAttr).toBe('true');
  });
});
