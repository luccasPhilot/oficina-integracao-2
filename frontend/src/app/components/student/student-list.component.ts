import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PageComponent } from '../../shared/components/page/page.component';

@Component({
  selector: 'student-list',
  imports: [PageComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
})
export class StudentListComponent {
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router
  ) { }

  addStudent(): void {
    this.router.navigate(['/student-list/add']);
  }
}
