import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular'; // Ionic's secure storage
import { Device } from '@capacitor/device'; // Capacitor plugin to get UUID

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private ionicStorage = inject(Storage);

  private API_URL = 'http://localhost:8080/api/users';

  private currentUser: any = null;
  private storage: Storage | null = null;

  constructor() {
    this.initStorage();
  }

  async initStorage() {
    this.storage = await this.ionicStorage.create();
  }

  /**
   * 1. The main "login with password" function.
   */
  async loginWithPassword(username: string, password: string): Promise<any> {
    const deviceId = await Device.getId();

    const loginRequest = {
      username: username,
      password: password,
      deviceUuid: deviceId.identifier
    };

    return this.http.post(`${this.API_URL}/login`, loginRequest).pipe(
      tap((user: any) => this.storeUser(user))
    ).toPromise();
  }

  /**
   * 2. The automatic "login with UUID" function.
   */
  async loginWithUuid(): Promise<any> {
    const deviceId = await Device.getId();

    const loginRequest = {
      deviceUuid: deviceId.identifier
    };

    return this.http.post(`${this.API_URL}/login-uuid`, loginRequest, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap((user: any) => this.storeUser(user))
    ).toPromise().catch(err => {
      // 401 is expected on first launch - device not registered yet
      if (err.status === 401) {
        return null;
      }
      // Only log/throw for unexpected errors (500, network issues, etc.)
      console.error('UUID login error:', err);
      throw err;
    });
  }

  /**
   * 3. The "register" function.
   */
  async register(username: string, password: string, email: string): Promise<any> {
    const deviceId = await Device.getId();

    const registerRequest = {
      username: username,
      password: password,
      email: email,
      deviceUuid: deviceId.identifier
    };

    return this.http.post(`${this.API_URL}/register`, registerRequest).pipe(
      tap((user: any) => this.storeUser(user))
    ).toPromise();
  }

  // --- Helper Functions ---

  private async storeUser(user: any) {
    this.currentUser = user;
    await this.storage?.set('currentUser', user);
  }

  public getCurrentUser(): any {
    return this.currentUser;
  }

  public async getStoredUser(): Promise<any> {
    if (!this.storage) await this.initStorage();
    const user = await this.storage?.get('currentUser');
    if (user) {
      this.currentUser = user;
    }
    return user;
  }

  public async logout() {
    this.currentUser = null;
    await this.storage?.remove('currentUser');
  }
}

