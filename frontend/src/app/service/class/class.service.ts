import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { Turma } from '../../shared/interfaces/turma.interface';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  public URL = `${environment.apiUrl}/`

  private readonly apiService = inject(ApiService);

  public addClass(request: Turma): Observable<any> {
    return this.apiService.post(this.URL, 'turma', request, undefined, undefined, { withCredentials: true })
      .pipe(take(1));
  }

  public getClass(classId: string): Observable<any> {
    return this.apiService.get(this.URL, 'turma/id', [{ name: 'id', value: classId }], undefined, { withCredentials: true })
      .pipe(take(1));
  }

  public getAllClasses(): Observable<any> {
    return this.apiService.get(this.URL, 'turma', undefined, undefined, { withCredentials: true })
      .pipe(take(1));
  }

  public updateClass(classId: string, request: Turma): Observable<any> {
    return this.apiService.put(this.URL, 'turma/id', request, [{ name: 'id', value: classId }])
      .pipe(take(1));
  }

  public deleteClass(classId: string): Observable<any> {
    return this.apiService.delete(this.URL, 'turma/id', {}, [{ name: 'id', value: classId }])
      .pipe(take(1));
  }
}