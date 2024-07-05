import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'error';
  showPassword = false;

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      userOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.loginForm.valid) {
      const { userOrEmail, password } = this.loginForm.value;

      this.authService.login({ userOrEmail, password }).pipe(
        catchError(error => {
          if (error.status === 400) {
            this.showErrorToast(error.error.error || 'Usuario no encontrado o contraseña incorrecta');
          } else {
            this.showErrorToast('Error en el servidor. Intente más tarde.');
          }
          return of(null);
        })
      ).subscribe(response => {
        if (response && response.token) {
          this.authService.setToken(response.token);
          this.showSuccessToast('Login exitoso');
          this.router.navigate(['/feed']);
        }
      });
    } else {
      this.showErrorToast('Por favor, complete todos los campos correctamente');
    }
  }

  showSuccessToast(message: string) {
    this.toastMessage = message;
    this.toastType = 'success';
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  showErrorToast(message: string) {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}