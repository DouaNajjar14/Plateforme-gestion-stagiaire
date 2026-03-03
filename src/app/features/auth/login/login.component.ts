import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = false;
  emailFocused = false;
  passwordFocused = false;

  // Pattern: min 8 chars, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
  private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  // Pattern: email doit se terminer par @ooredoo.tn
  private emailPattern = /^[a-zA-Z0-9._%+-]+@ooredoo\.tn$/;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      motDePasse: ['', [Validators.required, Validators.pattern(this.passwordPattern)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        const user = this.authService.currentUser();
        if (user?.role === Role.AGENT_RH) {
          this.router.navigate(['/agent-rh/dashboard']);
        } else {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        if (error.status === 401) {
          this.errorMessage.set('Email ou mot de passe incorrect');
        } else if (error.status === 0) {
          this.errorMessage.set('Impossible de se connecter au serveur');
        } else {
          this.errorMessage.set(error.error?.message || 'Une erreur est survenue');
        }
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get motDePasse() {
    return this.loginForm.get('motDePasse');
  }
}
