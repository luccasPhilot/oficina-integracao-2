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
      'getAllRepresentatives',
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

  it('deve carregar os representantes no ngOnInit', () => {
    serviceMock.getAllRepresentatives.and.returnValue(of([
      { id: 1, nome: 'Teste', filtered: true }
    ]));

    component.ngOnInit();

    expect(serviceMock.getAllRepresentatives).toHaveBeenCalled();
    expect(component.representativesList.length).toBe(1);
  });

  it('getRepresentatives deve aplicar feedback em caso de erro', () => {
    serviceMock.getAllRepresentatives.and.returnValue(
      throwError(() => new Error('Erro'))
    );

    component.getRepresentatives();

    expect(component.feedbackType()).toBe('error');
    expect(component.feedbackMessage().length).toBeGreaterThan(0);
  });

  it('getInitials deve retornar iniciais corretas (nome composto)', () => {
    expect(component.getInitials('Maria Silva')).toBe('MS');
  });

  it('getInitials deve retornar duas letras do nome único', () => {
    expect(component.getInitials('Mariana')).toBe('MA');
  });

  it('getInitials deve retornar vazio se nome vazio', () => {
    expect(component.getInitials('')).toBe('');
  });

  it('addRepresentative deve abrir o dialog e aplicar feedback', () => {
    const dialogRefMock = {
      afterClosed: () => of({ message: 'Criado!', type: 'success' })
    };

    dialogMock.open.and.returnValue(dialogRefMock as any);

    spyOn(component, 'getRepresentatives');

    component.addRepresentative();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(component.feedbackMessage()).toBe('Criado!');
    expect(component.feedbackType()).toBe('failure');
    expect(component.getRepresentatives).toHaveBeenCalled();
  });

  it('addRepresentative não deve fazer nada se fechar sem resultado', () => {
    const dialogRefMock = { afterClosed: () => of(null) };

    dialogMock.open.and.returnValue(dialogRefMock as any);

    spyOn(component, 'getRepresentatives');

    component.addRepresentative();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(component.feedbackMessage()).toBe(''); // não alterado
    expect(component.getRepresentatives).not.toHaveBeenCalled();
  });

  it('editRepresentative deve abrir o dialog e aplicar feedback', () => {
    const fakeItem = { id: 1, nome: 'Teste' } as any;
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

  it('editRepresentative não deve aplicar feedback se fechado sem resultado', () => {
    const fakeItem = { id: 1 } as any;
    const dialogRefMock = { afterClosed: () => of(null) };

    dialogMock.open.and.returnValue(dialogRefMock as any);

    const fakeEvent = new MouseEvent('click');
    spyOn(fakeEvent, 'stopPropagation');

    component.editRepresentative(fakeItem, fakeEvent);

    expect(component.feedbackMessage()).toBe(''); // não mudou
  });

  it('deleteRepresentative deve deletar e aplicar feedback de sucesso', () => {
    const fakeItem = { id: 55 } as any;

    serviceMock.deleteRepresentative.and.returnValue(
      of({ message: 'Removido!' })
    );
    spyOn(component, 'getRepresentatives');

    const fakeEvent = new MouseEvent('click');
    spyOn(fakeEvent, 'stopPropagation');

    component.deleteRepresentative(fakeItem, fakeEvent);

    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    expect(component.feedbackMessage()).toBe('Removido!');
    expect(component.feedbackType()).toBe('success');
    expect(component.getRepresentatives).toHaveBeenCalled();
  });

  it('deleteRepresentative deve aplicar feedback de erro no catch', () => {
    const fakeItem = { id: 55 } as any;

    serviceMock.deleteRepresentative.and.returnValue(
      throwError(() => new Error('Erro apagar'))
    );

    const fakeEvent = new MouseEvent('click');
    spyOn(fakeEvent, 'stopPropagation');

    component.deleteRepresentative(fakeItem, fakeEvent);

    expect(component.feedbackType()).toBe('error');
  });

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
