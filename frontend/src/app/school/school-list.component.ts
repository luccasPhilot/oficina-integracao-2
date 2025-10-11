import { Component } from '@angular/core';
import { PageComponent } from '../shared/components/page/page.component';
import { MatTableDataSource } from '@angular/material/table';
import { ITeam } from '../shared/interfaces/team.interface';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'school-list',
  imports: [PageComponent],
  templateUrl: './school-list.component.html',
  styleUrl: './school-list.component.scss'
})
export class SchoolListComponent {
  dataSource = new MatTableDataSource<ITeam>([]);

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  addSchool(): void {
    this.router.navigate(['/school-list/add']);
  }
}
