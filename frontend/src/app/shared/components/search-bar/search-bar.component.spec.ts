import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
    let component: SearchBarComponent;
    let fixture: ComponentFixture<SearchBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SearchBarComponent,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule,
                FormsModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should render the input with default placeholder', () => {
        const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        expect(input.placeholder).toBe('Pesquise aqui');
    });

    it('should update searchQuery when typing in the input', () => {
        const input = fixture.debugElement.query(By.css('input')).nativeElement;

        input.value = 'abc';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.searchQuery).toBe('abc');
    });

    it('should filter items correctly when applySearch() is called', () => {
        component.dataSource = [
            { name: 'João', age: 20 },
            { name: 'Maria', age: 30 },
            { name: 'Carlos', age: 40 },
        ];
        component.searchQuery = 'mar';
        fixture.detectChanges();

        component.applySearch();

        expect(component.dataSource[0].filtered).toBeTrue();
        expect(component.dataSource[1].filtered).toBeFalse();
        expect(component.dataSource[2].filtered).toBeTrue();
    });

    it('should remove all filters when searchQuery is empty', () => {
        component.dataSource = [
            { name: 'Teste 1' },
            { name: 'Teste 2' },
        ];

        component.searchQuery = '1';
        component.applySearch();

        expect(component.dataSource[0].filtered).toBeFalse();
        expect(component.dataSource[1].filtered).toBeTrue();

        component.searchQuery = '';
        component.applySearch();

        expect(component.dataSource[0].filtered).toBeFalse();
        expect(component.dataSource[1].filtered).toBeFalse();
    });

    it('should call applySearch when input changes', () => {
        spyOn(component, 'applySearch');

        const input = fixture.debugElement.query(By.css('input')).nativeElement;

        input.value = 'algo';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.applySearch).toHaveBeenCalled();
    });
});
