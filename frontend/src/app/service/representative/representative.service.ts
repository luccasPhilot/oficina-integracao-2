import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { Representante } from '../../shared/interfaces/representante.interface';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class RepresentativeService {

  public URL = `${environment.apiUrl}/`

  private readonly apiService = inject(ApiService);

  public addRepresentative(request: Representante): Observable<any> {
    return this.apiService.post(this.URL, 'representante', request, undefined, undefined, { withCredentials: true })
      .pipe(take(1));
  }

  public getRepresentative(representativeId: string): Observable<any> {
    return this.apiService.get(this.URL, 'representante/id', [{ name: 'id', value: representativeId }], undefined, { withCredentials: true })
      .pipe(take(1));
  }

  public getAllRepresentatives(): Observable<any> {
    return this.apiService.get(this.URL, 'representante', undefined, undefined, { withCredentials: true })
      .pipe(take(1));
  }

  public updateRepresentative(representativeId: string, request: Representante): Observable<any> {
    return this.apiService.put(this.URL, 'representante/id', request, [{ name: 'id', value: representativeId }])
      .pipe(take(1));
  }

  public deleteRepresentative(representativeId: string): Observable<any> {
    return this.apiService.delete(this.URL, 'representante/id', {}, [{ name: 'id', value: representativeId }])
      .pipe(take(1));
  }
}