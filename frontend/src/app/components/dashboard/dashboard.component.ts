import { Component } from '@angular/core';
import { PageComponent } from '../../shared/components/page/page.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'dashboard',
  imports: [PageComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(private http: HttpClient, private router: Router) {}
}
