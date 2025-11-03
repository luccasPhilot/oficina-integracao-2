import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PageComponent } from '../../shared/components/page/page.component';

@Component({
  selector: 'representative-list',
  imports: [PageComponent],
  templateUrl: './representative-list.component.html',
  styleUrl: './representative-list.component.scss',
})
export class RepresentativeListComponent {
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router
  ) { }

  addRepresentative(): void {
    this.router.navigate(['/representative-list/add']);
  }
}
