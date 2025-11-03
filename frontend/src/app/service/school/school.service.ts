import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { Escola } from '../../shared/interfaces/escola.interface';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  public URL = `${environment.apiUrl}/`

  private readonly apiService = inject(ApiService);

  public addSchool(request: Escola): Observable<any> {
    return this.apiService.post(this.URL, 'escola', request, undefined, undefined, { withCredentials: true })
      .pipe(take(1));
  }

  public getSchool(schoolId: string): Observable<any> {
    return this.apiService.get(this.URL, 'escola/id', [{ name: 'id', value: schoolId }], undefined, { withCredentials: true })
      .pipe(take(1));
  }

  public getAllSchools(): Observable<any> {
    return this.apiService.get(this.URL, 'escola', undefined, undefined, { withCredentials: true })
      .pipe(take(1));
  }

  public updateSchool(schoolId: string, request: Escola): Observable<any> {
    return this.apiService.put(this.URL, 'escola/id', request, [{ name: 'id', value: schoolId }])
      .pipe(take(1));
  }

  public deleteSchool(schoolId: string): Observable<any> {
    return this.apiService.delete(this.URL, 'escola/id', {}, [{ name: 'id', value: schoolId }])
      .pipe(take(1));
  }
}