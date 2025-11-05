import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { firstValueFrom, BehaviorSubject, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppUser } from '../models/user.model';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(Storage);
  private platform = inject(Platform);
  private router = inject(Router);

  // This still points to /api/users, which is correct
  private apiUrl = `${environment.apiUrl}/api/users`;

  private currentUser = new BehaviorSubject<AppUser | null>(null);

  constructor() {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  getCurrentUser() {
    return this.currentUser.asObservable();
  }

  async getStoredUser(): Promise<AppUser | null> {
    const user = await this.storage.get('app_user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Logs in with the "loginIdentifier" (username OR email).
   */
  async loginWithPassword(loginIdentifier: string, password: string, rememberMe: boolean): Promise<AppUser> {
    const endpoint = `${this.apiUrl}/login`;

    // The DTO now expects 'loginIdentifier'
    const payload: any = {
      loginIdentifier: loginIdentifier,
      password: password
    };

    if (rememberMe) {
      const deviceId = await Device.getId();
      payload.deviceUuid = deviceId.identifier;
    }

    const user = await firstValueFrom(
      this.http.post<AppUser>(endpoint, payload)
    );

    await this.storeUserAndNotify(user);
    return user;
  }

  /**
   * Registers with the fields from the doc.
   */
  async register(payload: any): Promise<AppUser> {
    const endpoint = `${this.apiUrl}/register`;

    const deviceId = await Device.getId();

    // The DTO for register is unchanged
    const dataToSend = {
      username: payload.username,
      password: payload.password,
      email: payload.email,
      deviceUuid: deviceId.identifier
    };

    const user = await firstValueFrom(
      this.http.post<AppUser>(endpoint, dataToSend)
    );

    await this.storeUserAndNotify(user);
    return user;
  }

  /**
   * loginWithUuid is unchanged and correct.
   */
  async loginWithUuid(): Promise<AppUser | null> {
    if (!this.platform.is('capacitor')) {
      return null;
    }

    const deviceId = await Device.getId();

    const endpoint = `${this.apiUrl}/login-uuid`;
    const payload = {
      deviceUuid: deviceId.identifier
    };

    try {
      const user = await firstValueFrom(
        this.http.post<AppUser>(endpoint, payload)
      );

      await this.storeUserAndNotify(user);
      return user;

    } catch (err) {
      console.warn('UUID login failed', err);
      return null;
    }
  }

  getToken() {
    return from(this.storage.get('auth_token'));
  }

  async logout() {
    await this.storage.remove('app_user');
    await this.storage.remove('auth_token');
    this.currentUser.next(null);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  private async storeUserAndNotify(user: AppUser) {
    await this.storage.set('app_user', JSON.stringify(user));
    // This is from our interceptor setup, it's critical
    if (user.token) {
      await this.storage.set('auth_token', user.token);
    }
    this.currentUser.next(user);
  }
}
