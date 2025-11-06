import { Injectable, inject } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  // Use inject() for a modern, clean approach
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * canLoad is used for lazy-loaded modules. It checks for auth
   * *before* even loading the code for the /tabs pages.
   */
  async canLoad(): Promise<boolean> {

    // Check if we have a user in secure storage
    const user = await this.authService.getStoredUser();

    if (user) {
      // We have a user, they are authenticated. Allow access.
      return true;
    }

    // No user found, redirect them to the login page
    this.router.navigateByUrl('/login');
    return false;
  }
}
