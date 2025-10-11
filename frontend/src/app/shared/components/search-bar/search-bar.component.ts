import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';
import { INews } from '../../interfaces/news.interface';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatIconModule]
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Pesquise aqui';
  @Input() dataSource: MatTableDataSource<any> | INews[] = [];
  @Input() searchQuery: string = '';
  @Output() dataSourceChange = new EventEmitter<INews[]>();

  applySearch(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (this.dataSource instanceof MatTableDataSource) {
      this.dataSource.filter = query;
    } else if (Array.isArray(this.dataSource)) {
      if (!query) {
        this.dataSource.forEach(item => item.filtered = false);
      } else {
        this.dataSource.forEach(item => {
          const match = Object.values(item)
            .join(' ')
            .toLowerCase()
            .includes(query);
          item.filtered = !match;
        });
      }
    }
  }
}