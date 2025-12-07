import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, throwError } from 'rxjs';
import { SchoolService } from '../../service/school/school.service';
import { Escola } from '../../shared/interfaces/escola.interface';
import { SchoolListComponent } from './school-list.component';

class SchoolServiceMock {
  getAllSchools(): Observable<Escola[]> {
    return of([] as Escola[]);
  }
  deleteSchool(id: string): Observable<any> {
    return of({ message: 'ok' });
  }
  downloadSchoolPdfCartaConvenio(id: string): Observable<Blob> {
    return of(new Blob(['test'], { type: 'application/pdf' }));
  }
  downloadSchoolPdfCartaConvite(id: string): Observable<Blob> {
    return of(new Blob(['test'], { type: 'application/pdf' }));
  }
}

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ message: 'ok', type: 'success' })
    };
  }
}

describe('SchoolListComponent', () => {
  let component: SchoolListComponent;
  let fixture: ComponentFixture<SchoolListComponent>;
  let schoolService: SchoolServiceMock;
  let dialog: MatDialogMock;

  const mockSchools: Escola[] = [
    {
      id: '1',
      nome: 'Escola Teste A',
      endereco: '',
      telefone: '',
      cidade: 'Cidade A',
      estado: 'SP',
      email: '',
      createdAt: "date",
      filtered: false
    },
    {
      id: '2',
      nome: 'Escola Teste B',
      endereco: '',
      telefone: '',
      cidade: 'Cidade B',
      estado: 'RJ',
      email: '',
      createdAt: "date",
      filtered: false
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolListComponent, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: SchoolService, useClass: SchoolServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolListComponent);
    component = fixture.componentInstance;

    schoolService = TestBed.inject(SchoolService) as any;
    dialog = TestBed.inject(MatDialog) as any;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar escolas no ngOnInit', () => {
    spyOn(schoolService, 'getAllSchools').and.returnValue(of(mockSchools));
    component.ngOnInit();
    expect(component.schoolsList).toEqual(mockSchools);
  });

  it('deve tratar erro ao carregar escolas', () => {
    spyOn(schoolService, 'getAllSchools').and.returnValue(throwError(() => new Error()));
    component.getSchools();
    expect(component.feedbackType()).toBe('error');
  });

  it('deve retornar iniciais corretamente', () => {
    expect(component.getInitials('Maria Joaquina')).toBe('MJ');
    expect(component.getInitials('Carlos')).toBe('CA');
    expect(component.getInitials('')).toBe('');
    expect(component.getInitials('A')).toBe('A');
  });

  it('deve abrir modal ao adicionar escola e atualizar lista se houver resultado', () => {
    spyOn(dialog, 'open').and.callThrough();
    spyOn(component, 'getSchools');

    component.addSchool();

    expect(dialog.open).toHaveBeenCalled();
    expect(component.getSchools).toHaveBeenCalled();
  });

  it('NÃO deve atualizar lista ao adicionar escola se o modal for fechado sem resultado', () => {
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(null)
    } as any);
    spyOn(component, 'getSchools');

    component.addSchool();

    expect(dialog.open).toHaveBeenCalled();
    expect(component.getSchools).not.toHaveBeenCalled();
  });

  it('deve abrir modal ao editar escola e atualizar lista se houver resultado', () => {
    spyOn(dialog, 'open').and.callThrough();
    spyOn(component, 'getSchools');
    const event = new MouseEvent('click');
    const school = mockSchools[0];

    component.editSchool(school, event);

    expect(dialog.open).toHaveBeenCalled();
    expect(component.getSchools).toHaveBeenCalled();
  });

  it('NÃO deve atualizar lista ao editar escola se o modal for fechado sem resultado', () => {
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(undefined)
    } as any);
    spyOn(component, 'getSchools');
    const event = new MouseEvent('click');
    const school = mockSchools[0];

    component.editSchool(school, event);

    expect(component.getSchools).not.toHaveBeenCalled();
  });

  it('deve deletar escola com sucesso', () => {
    spyOn(schoolService, 'deleteSchool').and.returnValue(of({ message: 'ok' }));
    spyOn(component, 'getSchools');
    const event = new MouseEvent('click');
    const school = mockSchools[0];

    component.deleteSchool(school, event);

    expect(schoolService.deleteSchool).toHaveBeenCalledWith(school.id);
    expect(component.getSchools).toHaveBeenCalled();
    expect(component.feedbackType()).toBe('success');
  });

  it('deve tratar erro ao deletar escola', () => {
    spyOn(schoolService, 'deleteSchool').and.returnValue(throwError(() => new Error('Erro')));
    const event = new MouseEvent('click');
    const school = mockSchools[0];

    component.deleteSchool(school, event);

    expect(component.feedbackType()).toBe('error');
    expect(component.feedbackMessage()).toBe('Erro ao deletar Escola. Tente novamente.');
  });

  it('listHasSchools deve retornar true só quando todas escolas estão filtradas', () => {
    component.schoolsList = [
      { ...mockSchools[0], filtered: true },
      { ...mockSchools[1], filtered: true }
    ];
    expect(component.listHasSchools()).toBeTrue();

    component.schoolsList = [
      { ...mockSchools[0], filtered: false },
      { ...mockSchools[1], filtered: true }
    ];
    expect(component.listHasSchools()).toBeFalse();
  });

  describe('downloadPdf', () => {
    let linkSpy: jasmine.SpyObj<HTMLAnchorElement>;

    beforeEach(() => {
      linkSpy = jasmine.createSpyObj('a', ['click']);
      spyOn(document, 'createElement').and.returnValue(linkSpy);

      if (!window.URL.createObjectURL) {
        Object.defineProperty(window.URL, 'createObjectURL', { value: jasmine.createSpy('createObjectURL') });
      } else {
        spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
      }

      if (!window.URL.revokeObjectURL) {
        Object.defineProperty(window.URL, 'revokeObjectURL', { value: jasmine.createSpy('revokeObjectURL') });
      } else {
        spyOn(window.URL, 'revokeObjectURL');
      }
    });

    it('deve baixar PDF do tipo "convenio" com sucesso', () => {
      spyOn(schoolService, 'downloadSchoolPdfCartaConvenio').and.callThrough();

      component.downloadPdf('1', 'EscolaA', 'convenio');

      expect(schoolService.downloadSchoolPdfCartaConvenio).toHaveBeenCalledWith('1');
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(linkSpy.click).toHaveBeenCalled();
      expect(linkSpy.download).toBe('EscolaA-convenio.pdf');
      expect(component.feedbackType()).toBe('success');
    });

    it('deve baixar PDF do tipo "convite" com sucesso', () => {
      spyOn(schoolService, 'downloadSchoolPdfCartaConvite').and.callThrough();

      component.downloadPdf('1', 'EscolaA', 'convite');

      expect(schoolService.downloadSchoolPdfCartaConvite).toHaveBeenCalledWith('1');
      expect(linkSpy.download).toBe('EscolaA-convite.pdf');
    });

    it('deve mostrar erro se o tipo de carta for inválido', () => {
      component.downloadPdf('1', 'EscolaA', 'tipo_inexistente');

      expect(component.feedbackType()).toBe('error');
      expect(component.feedbackMessage()).toBe('Tipo de carta inválido.');
      expect(document.createElement).not.toHaveBeenCalled();
    });

    it('deve mostrar erro se o serviço de download falhar', () => {
      spyOn(schoolService, 'downloadSchoolPdfCartaConvenio').and.returnValue(throwError(() => new Error()));

      component.downloadPdf('1', 'EscolaA', 'convenio');

      expect(component.feedbackType()).toBe('error');
      expect(component.feedbackMessage()).toBe('Erro ao baixar PDF.');
    });
  });

});