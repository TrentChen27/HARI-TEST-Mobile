import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  // Use inject() for modern, clean DI
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  loginForm: FormGroup;
  isRegistering = false;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.email]]
    });
  }

  ngOnInit() {
    // When the page loads, try to auto-login
    console.log('LoginPage ngOnInit called');
    this.tryAutoLogin();
  }

  async tryAutoLogin() {
    console.log('tryAutoLogin started');
    const loading = await this.loadingCtrl.create({ message: 'Logging in...' });
    await loading.present();

    try {
      const user = await this.authService.loginWithUuid();
      if (user) {
        // SUCCESS: UUID login worked! Go to the main app.
        this.router.navigateByUrl('/tabs/home');
      }
      // If no user, do nothing. Just stay on the login page.
    } catch (error) {
      // Error (e.g., 404, 500), just stay on login page.
      console.warn('No stored UUID login found.');
    } finally {
      loading.dismiss();
    }
  }

  // Called when the user clicks the "Login" or "Register" button
  async onSubmit() {
    if (this.loginForm.invalid) {
      return; // Form is not valid, do nothing
    }

    const loading = await this.loadingCtrl.create({ message: 'Please wait...' });
    await loading.present();

    // Get values from the form
    const { username, password, email } = this.loginForm.value;

    try {
      if (this.isRegistering) {
        // --- REGISTER FLOW ---
        if (!this.loginForm.get('email')?.valid) {
          this.showToast('Please provide a valid email to register.');
          loading.dismiss();
          return;
        }
        await this.authService.register(username, password, email);
      } else {
        // --- LOGIN FLOW ---
        await this.authService.loginWithPassword(username, password);
      }

      // SUCCESS (for both login and register): Go to the main app
      this.router.navigateByUrl('/tabs/home');

    } catch (err) {
      console.error(err);
      this.showToast('Login failed. Please check your credentials.');
    } finally {
      loading.dismiss();
    }
  }

  // Helper function to toggle the form mode
  toggleForm() {
    this.isRegistering = !this.isRegistering;

    // Toggle the email validator
    const emailControl = this.loginForm.get('email');
    if (this.isRegistering) {
      emailControl?.setValidators([Validators.required, Validators.email]);
    } else {
      emailControl?.clearValidators();
    }
    emailControl?.updateValueAndValidity();
  }

  // Helper for showing error messages
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: 'danger'
    });
    toast.present();
  }
}
