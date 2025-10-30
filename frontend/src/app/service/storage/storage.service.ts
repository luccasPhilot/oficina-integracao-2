import { Injectable } from '@angular/core';


import { SessionData } from '../../shared/interfaces/common.interface';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // Session data variables (names)
  private readonly sessionData: SessionData = {
    token: 'access_token',
  }

  // Get Access Token
  public getToken(): string | null {
    return sessionStorage.getItem(this.sessionData.token);
  }

}
