import { Component } from '@angular/core';
import { PageComponent } from '../shared/components/page/page.component';
import { MatTableDataSource } from '@angular/material/table';
import { ITeam } from '../shared/interfaces/team.interface';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'student-list',
  imports: [PageComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent {
  dataSource = new MatTableDataSource<ITeam>([]);

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  addStudent(): void {
    this.router.navigate(['/student-list/add']);
  }
}
