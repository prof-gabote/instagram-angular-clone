import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { TokenService } from '../../../services/token.service';

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
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tokenService: TokenService) {
    this.loginForm = this.fb.group({
      userOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.loginForm.valid) {
      const { userOrEmail, password } = this.loginForm.value;
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

      const user = storedUsers.find((u: any) =>
        (u.username === userOrEmail || u.email === userOrEmail) && u.password === password
      );

      if (user) {
        const token = this.tokenService.generateRandomString(16);
        localStorage.setItem('token', token);
        this.router.navigate(['/feed']);
      } else {
        this.showErrorToast('Invalid username/email or password');
      }
    } else {
      this.showErrorToast('Please fill all required fields correctly');
    }
  }

  showErrorToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}