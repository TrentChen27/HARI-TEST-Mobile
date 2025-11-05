import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  // --- Injected Services ---
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  loginForm: FormGroup;
  isRegistering = false;

  constructor() {
    this.loginForm = this.fb.group({
      // --- Login-Only Fields ---
      loginIdentifier: [''],
      rememberMe: [false],

      // --- Common Field ---
      password: ['', [Validators.required, Validators.minLength(6)]],

      // --- Register-Only Fields (Optional) ---
      firstName: [''], // No validator
      lastName: [''],  // No validator

      // --- Register-Only Fields (Required) ---
      username: [''],
      email: [''],
      passwordConfirm: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Set initial form state to LOGIN
    this.toggleForm(false);

    this.tryAutoLogin();
  }

  async tryAutoLogin() {
    console.log('tryAutoLogin started');
    const loading = await this.loadingCtrl.create({ message: 'Checking for stored login...' });
    await loading.present();
    try {
      const user = await this.authService.loginWithUuid();
      if (user) {
        // Update the existing loading message instead of creating a new loader
        loading.message = 'Welcome back! Logging in...';
        // small pause to ensure message updates visually
        await new Promise(res => setTimeout(res, 200));
        // SUCCESS: UUID login worked! Go to the main app.
        await this.router.navigateByUrl('/tabs/home');
      }
      // If no user, stay on the login page.
    } catch (error) {
      console.warn('No stored UUID login found.');
    } finally {
      await loading.dismiss();
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    if (control.get('email')?.validator) { // Checks if we are in register mode
      const password = control.get('password');
      const passwordConfirm = control.get('passwordConfirm');

      if (password && passwordConfirm && password.value !== passwordConfirm.value) {
        return { passwordMismatch: true };
      }
    }
    return null;
  }

  toggleForm(forceState?: boolean) {
    this.isRegistering = (forceState !== undefined) ? forceState : !this.isRegistering;

    const loginControl = this.loginForm.get('loginIdentifier');
    const rememberMeControl = this.loginForm.get('rememberMe');
    const regControls = {
      username: this.loginForm.get('username'),
      email: this.loginForm.get('email'),
      passwordConfirm: this.loginForm.get('passwordConfirm')
    };

    if (this.isRegistering) {
      // --- SET UP FOR REGISTER ---
      loginControl?.clearValidators();
      rememberMeControl?.clearValidators();
      rememberMeControl?.setValue(false);

      regControls.username?.setValidators([Validators.required, Validators.minLength(3)]);
      regControls.email?.setValidators([Validators.required, Validators.email]);
      regControls.passwordConfirm?.setValidators([Validators.required]);

    } else {
      // --- SET UP FOR LOGIN ---
      loginControl?.setValidators([Validators.required]);
      rememberMeControl?.setValue(true);

      for (const key in regControls) {
        regControls[key as keyof typeof regControls]?.clearValidators();
      }
    }

    this.loginForm.reset({ rememberMe: rememberMeControl?.value });
    this.loginForm.updateValueAndValidity();
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.showToast('Please check the form for errors.');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Please wait...' });
    await loading.present();

    const { loginIdentifier, username, password, email, rememberMe } = this.loginForm.value;

    try {
      if (this.isRegistering) {
        // --- REGISTER FLOW ---
        // Backend DTO needs username, password, email
        await this.authService.register({ username, password, email });
      } else {
        // --- LOGIN FLOW ---
        // Backend DTO needs loginIdentifier, password
        await this.authService.loginWithPassword(loginIdentifier, password, rememberMe);
      }

      this.router.navigateByUrl('/tabs/home');

    } catch (err) {
      console.error(err);
      this.showToast('Operation failed. Please check your details and try again.');
    } finally {
      loading.dismiss();
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    });
    toast.present();
  }
}
