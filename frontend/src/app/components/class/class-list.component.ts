import { Component } from '@angular/core';
import { PageComponent } from '../../shared/components/page/page.component';
import { MatTableDataSource } from '@angular/material/table';
import { ITeam } from '../../shared/interfaces/team.interface';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'class-list',
  imports: [PageComponent],
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.scss',
})
export class ClassListComponent {
  dataSource = new MatTableDataSource<ITeam>([]);

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router
  ) {}

  addClass(): void {
    this.router.navigate(['/class-list/add']);
  }
}
