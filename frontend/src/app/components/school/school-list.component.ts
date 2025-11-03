import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PageComponent } from '../../shared/components/page/page.component';

@Component({
  selector: 'school-list',
  imports: [PageComponent],
  templateUrl: './school-list.component.html',
  styleUrl: './school-list.component.scss',
})
export class SchoolListComponent {
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router
  ) { }

  addSchool(): void {
    this.router.navigate(['/school-list/add']);
  }
}
