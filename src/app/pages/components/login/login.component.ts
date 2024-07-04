import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { User } from '../../../models/user.model';
import { UserDataService } from '../../../services/userdata.service';
import { catchError, switchMap, of } from 'rxjs';

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

  private userDataService: UserDataService = inject(UserDataService);
  private tokenService: TokenService = inject(TokenService);
  private router: Router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      userOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { userOrEmail, password } = this.loginForm.value;

      this.userDataService.getUserData().pipe(
        switchMap(users => {
          const user = users.find(u => 
            (u.username === userOrEmail || u.email === userOrEmail) && u.password === password
          );

          if (user) {
            const token = this.tokenService.generateRandomString(16);
            const updatedUser: User = { ...user, token };
            const updatedUsers = users.map(u => u.username === user.username ? updatedUser : u);

            return this.userDataService.updateAllUserData(updatedUsers).pipe(
              switchMap(() => {
                localStorage.setItem('token', token);
                this.showSuccessToast('Login successful');
                return of(updatedUser);
              })
            );
          } else {
            throw new Error('Invalid username/email or password');
          }
        }),
        catchError(error => {
          this.showErrorToast(error.message);
          return of(null);
        })
      ).subscribe(userData => {
        if (userData) {
          this.router.navigate(['/feed']);
        }
      });
    } else {
      this.showErrorToast('Please fill all required fields correctly');
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