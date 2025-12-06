import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { RepresentativeService } from '../../service/representative/representative.service';
import { RepresentativeListComponent } from './representative-list.component';

describe('RepresentativeListComponent', () => {
  let component: RepresentativeListComponent;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let serviceMock: jasmine.SpyObj<RepresentativeService>;

  beforeEach(() => {
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    serviceMock = jasmine.createSpyObj('RepresentativeService', [
      'deleteRepresentative'
    ]);

    TestBed.configureTestingModule({
      imports: [RepresentativeListComponent, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: RepresentativeService, useValue: serviceMock }
      ]
    });

    const fixture = TestBed.createComponent(RepresentativeListComponent);
    component = fixture.componentInstance;
  });

  // -----------------------------
  // ngOnInit / getRepresentatives
  // -----------------------------
  it('deve carregar os representantes no ngOnInit', () => {
    component.ngOnInit();
    expect(component.representativesList.length).toBe(5); // mock possui 5 itens
  });

  it('getRepresentatives deve preencher a lista com os mocks', () => {
    component.getRepresentatives();
    expect(component.representativesList).toEqual(component.mockRepresentantes);
  });

  // -----------------------------
  // getInitials
  // -----------------------------
  it('getInitials deve retornar iniciais corretas (nome composto)', () => {
    expect(component.getInitials('Maria Silva')).toBe('MS');
  });

  it('getInitials deve retornar duas letras do nome único', () => {
    expect(component.getInitials('Mariana')).toBe('MA');
  });

  it('getInitials deve retornar vazio se nome vazio', () => {
    expect(component.getInitials('')).toBe('');
  });

  // -----------------------------
  // addRepresentative
  // -----------------------------
  it('addRepresentative deve abrir o dialog e aplicar feedback', () => {
    const dialogRefMock = {
      afterClosed: () => of({ message: 'Sucesso!', type: 'success' })
    };

    dialogMock.open.and.returnValue(dialogRefMock as any);

    spyOn(component, 'getRepresentatives');

    component.addRepresentative();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(component.feedbackMessage()).toBe('Sucesso!');
    expect(component.feedbackType()).toBe('success');
    expect(component.getRepresentatives).toHaveBeenCalled();
  });

  // -----------------------------
  // editRepresentative
  // -----------------------------
  it('editRepresentative deve abrir o dialog com dados e aplicar feedback', () => {
    const fakeItem = component.mockRepresentantes[0];

    const dialogRefMock = {
      afterClosed: () => of({ message: 'Atualizado!', type: 'success' })
    };

    dialogMock.open.and.returnValue(dialogRefMock as any);
    spyOn(component, 'getRepresentatives');

    const fakeEvent = new MouseEvent('click');
    spyOn(fakeEvent, 'stopPropagation');

    component.editRepresentative(fakeItem, fakeEvent);

    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    expect(dialogMock.open).toHaveBeenCalled();
    expect(component.feedbackMessage()).toBe('Atualizado!');
    expect(component.getRepresentatives).toHaveBeenCalled();
  });

  // -----------------------------
  // deleteRepresentative
  // -----------------------------
  it('deleteRepresentative deve deletar e aplicar feedback de sucesso', () => {
    const fakeItem = component.mockRepresentantes[0];

    serviceMock.deleteRepresentative.and.returnValue(
      of({ message: 'Removido com sucesso!' })
    );

    spyOn(component, 'getRepresentatives');

    const fakeEvent = new MouseEvent('click');
    spyOn(fakeEvent, 'stopPropagation');

    component.deleteRepresentative(fakeItem, fakeEvent);

    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    expect(component.feedbackMessage()).toBe('Removido com sucesso!');
    expect(component.feedbackType()).toBe('success');
    expect(component.getRepresentatives).toHaveBeenCalled();
  });

  it('deleteRepresentative deve aplicar feedback de erro', () => {
    const fakeItem = component.mockRepresentantes[0];

    serviceMock.deleteRepresentative.and.returnValue(
      throwError(() => ({ error: 'Falha' }))
    );

    const fakeEvent = new MouseEvent('click');
    spyOn(fakeEvent, 'stopPropagation');

    component.deleteRepresentative(fakeItem, fakeEvent);

    expect(component.feedbackType()).toBe('error');
  });

  // -----------------------------
  // listHasRepresentatives
  // -----------------------------
  it('listHasRepresentatives deve retornar true se todos estiverem filtrados', () => {
    component.representativesList = [
      { filtered: true } as any,
      { filtered: true } as any
    ];

    expect(component.listHasRepresentatives()).toBeTrue();
  });

  it('listHasRepresentatives deve retornar false se algum não estiver filtrado', () => {
    component.representativesList = [
      { filtered: true } as any,
      { filtered: false } as any
    ];

    expect(component.listHasRepresentatives()).toBeFalse();
  });
});
