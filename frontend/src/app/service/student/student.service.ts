import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { Aluno } from '../../shared/interfaces/aluno.interface';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  public URL = `${environment.apiUrl}/`

  private readonly apiService = inject(ApiService);

  public addStudent(request: Aluno): Observable<any> {
    return this.apiService.post(this.URL, 'aluno', request, undefined, undefined, { withCredentials: true })
      .pipe(take(1));
  }

  public getStudent(studentId: string): Observable<any> {
    return this.apiService.get(this.URL, 'aluno/id', [{ name: 'id', value: studentId }], undefined, { withCredentials: true })
      .pipe(take(1));
  }

  public getAllStudents(): Observable<any> {
    return this.apiService.get(this.URL, 'aluno', undefined, undefined, { withCredentials: true })
      .pipe(take(1));
  }

  public updateStudent(studentId: string, request: Aluno): Observable<any> {
    return this.apiService.put(this.URL, 'aluno/id', request, [{ name: 'id', value: studentId }])
      .pipe(take(1));
  }

  public deleteStudent(studentId: string): Observable<any> {
    return this.apiService.delete(this.URL, 'aluno/id', {}, [{ name: 'id', value: studentId }])
      .pipe(take(1));
  }
}