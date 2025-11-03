import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Services
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';

// Models
import { environment } from '../../environments/environment';
import { EndpointMark } from '../../shared/interfaces/endpoint-mark.interface';
import { HeaderType } from '../../shared/interfaces/enuns/header-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // API Auth token
  private readonly TOKEN: string = environment.token;

  private readonly http = inject(HttpClient);
  private readonly storageService = inject(StorageService);

  /**
   * GET method API call
   * Example marks: 
   *  - endpoint: find-brand/fuelType=#fuelType#&vehicleType=#vehicleType#
   *  - marks: [{name: '#fuelType#', value '1'}, {name: '#vehicleType#', value '2'}]
   *  - result: find-brand/fuelType=1&vehicleType=2
   * @param url call's url
   * @param endpoint call's endpoint with marks
   * @param marks parametres of the calls
   * @param headersType type of headers
   * @returns Response's observable ready to be subscribed
   */
  public get(url: string, endpoint: string, marks?: EndpointMark[], headersType?: HeaderType[], options?: any): Observable<any> {
    const fullUrl: string = this.getFullUrl(url, endpoint, marks);
    const headers: HttpHeaders = this.getHeaders(headersType);
    const finalOptions = {
      headers,
      ...options
    }
    return this.http.get<any>(fullUrl, finalOptions);
  }

  /**
   * POST method API  call
   * Example marks: 
   *  - endpoint: find-brand/fuelType=#fuelType#&vehicleType=#vehicleType#
   *  - marks: [{name: '#fuelType#', value '1'}, {name: '#vehicleType#', value '2'}]
   *  - result: find-brand/fuelType=1&vehicleType=2
   * @param url call's url
   * @param endpoint call's endpoint with marks
   * @param body requested body
   * @param marks parametres of the calls
   * @param headersType type of headers
   * @returns Response's observable ready to be subscribed
   */
  public post(url: string, endpoint: string, body: any, marks?: EndpointMark[], headersType?: HeaderType[], options?: any): Observable<any> {
    const fullUrl: string = this.getFullUrl(url, endpoint, marks);
    const headers: HttpHeaders = this.getHeaders(headersType);
    const finalOptions = {
      headers,
      ...options
    }
    return this.http.post<any>(fullUrl, body, finalOptions);
  }

  /**
    * PATCH method API  call
    * Example marks: 
    *  - endpoint: find-brand/fuelType=#fuelType#&vehicleType=#vehicleType#
    *  - marks: [{name: '#fuelType#', value '1'}, {name: '#vehicleType#', value '2'}]
    *  - result: find-brand/fuelType=1&vehicleType=2
    * @param url call's url
    * @param endpoint call's endpoint with marks
    * @param body requested patch body
    * @param marks parametres of the calls
    * @param headersType type of headers
    * @returns Response's observable ready to be subscribed
    */
  public patch(url: string, endpoint: string, body: any, marks?: EndpointMark[], headersType?: HeaderType[]): Observable<any> {
    const fullUrl: string = this.getFullUrl(url, endpoint, marks);
    const headers: HttpHeaders = this.getHeaders(headersType);
    return this.http.patch<any>(fullUrl, body, { headers: headers });
  }


  /**
  * PUT method API  call
  * Example marks: 
  *  - endpoint: find-brand/fuelType=#fuelType#&vehicleType=#vehicleType#
  *  - marks: [{name: '#fuelType#', value '1'}, {name: '#vehicleType#', value '2'}]
  *  - result: find-brand/fuelType=1&vehicleType=2
  * @param url call's url
  * @param endpoint call's endpoint with marks
  * @param body requested patch body
  * @param marks parametres of the calls
  * @param headersType type of headers
  * @returns Response's observable ready to be subscribed
  */
  public put(url: string, endpoint: string, body: any, marks?: EndpointMark[], headersType?: HeaderType[]): Observable<any> {
    const fullUrl: string = this.getFullUrl(url, endpoint, marks);
    const headers: HttpHeaders = this.getHeaders(headersType);
    return this.http.put<any>(fullUrl, body, { headers: headers });
  }

  /**
  * DELETE method API  call
  * Example marks: 
  *  - endpoint: find-brand/fuelType=#fuelType#&vehicleType=#vehicleType#
  *  - marks: [{name: '#fuelType#', value '1'}, {name: '#vehicleType#', value '2'}]
  *  - result: find-brand/fuelType=1&vehicleType=2
  * @param url call's url
  * @param endpoint call's endpoint with marks
  * @param body requested patch body
  * @param marks parametres of the calls
  * @param headersType type of headers
  * @returns Response's observable ready to be subscribed
  */
  public delete(url: string, endpoint: string, body?: any, marks?: EndpointMark[], headersType?: HeaderType[]): Observable<any> {
    const fullUrl: string = this.getFullUrl(url, endpoint, marks);
    const headers: HttpHeaders = this.getHeaders(headersType);
    return this.http.delete<any>(fullUrl, { headers: headers, body });
  }


  /**
   * Obtains the complete URL
   * @param url base URL
   * @param endpoint endpoint with marks
   * @param marks parametres of the calls
   * @returns complete url
   */
  private getFullUrl(url: string, endpoint: string, marks?: EndpointMark[]): string {
    return marks?.length
      ? url + this.getEndpointWithParams(endpoint, marks)
      : url + endpoint;
  }

  /**
   * Set the value of the endpoint's params
   * @param endpoint endpoint without params' values
   * @param marks marks (params of the endpoint: name and value)
   * @returns endpoint with params
   */
  private getEndpointWithParams(endpoint: string, marks: EndpointMark[]): string {
    let enpointsWithParams: string = endpoint;
    marks.forEach((mark: EndpointMark) => enpointsWithParams = enpointsWithParams.replace(mark.name, mark.value.toString()));
    return enpointsWithParams;
  }

  /**
   * Obtain the HttpHeaders from headers' type
   * @param headersType types of header to add
   * @returns HttpHeaders
   */
  private getHeaders(headersType?: HeaderType[]): HttpHeaders {
    let headers: HttpHeaders = new HttpHeaders({ 'Authorization': this.getToken() });
    // If there're headers'type add the headers
    if (headersType?.length) {
      headersType.forEach((headerType: HeaderType) => {
        switch (headerType) {
          case HeaderType.CONTENT_JSON:
            headers = headers.append('content-type', 'application/json');
            break;
          case HeaderType.CONTENT_MULTIPART:
            headers = headers.append('content-type', 'multipart/form-data');
            break;
          case HeaderType.ACCEPT_JSON:
            headers = headers.append('accept', 'application/json');
            break;
          case HeaderType.CORS:
            headers = headers.append('access-control-allow-origin', '*');
            break;
          case HeaderType.ALLOW_ALL_METHODS:
            headers = headers.append('access-control-allow-methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
            break;
          case HeaderType.ALLOW_COMMON_METHODS:
            headers = headers.append('access-control-allow-methods', 'POST, PUT, GET, OPTIONS, DELETE');
            break;
          default:
            break;
        }
      });
    }
    return headers;
  }

  /**
   * Obtain the API token if it exits, otherwise the local token will be used
   * @returns token to be used at the auth header
   */
  public getToken(): string {
    const accessToken: string | null = this.storageService.getToken();
    return accessToken
      ? `Bearer ${accessToken}`
      : `Bearer ${this.TOKEN}`;
  }

}