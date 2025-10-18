import { Component } from '@angular/core';
import { PageComponent } from '../../shared/components/page/page.component';
import { MatTableDataSource } from '@angular/material/table';
import { ITeam } from '../../shared/interfaces/team.interface';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'representative-list',
  imports: [PageComponent],
  templateUrl: './representative-list.component.html',
  styleUrl: './representative-list.component.scss',
})
export class RepresentativeListComponent {
  dataSource = new MatTableDataSource<ITeam>([]);

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router
  ) {}

  addRepresentative(): void {
    this.router.navigate(['/representative-list/add']);
  }
}
