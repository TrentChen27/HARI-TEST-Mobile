import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public readonly apiUrl: string;

  constructor() {
    const hostname = window.location.hostname;

    if (hostname === 'localhost') {
      // We are on the PC browser
      this.apiUrl = 'http://localhost:8080';
    } else {
      this.apiUrl = `http://${hostname}:8080`;
    }

    console.log('API URL configured to:', this.apiUrl);
  }
}
