import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  users: any[] = [];
  submitted = false;
  showPassword = false;
  showRepeatPassword = false;
  showToast = false;
  toastMessage = '';
  toastType = '';
  toastClasses: string[] = ['bg-danger-subtle', 'bg-success-subtle'];
  toastClass = '';


  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      repeatPassword: ['', Validators.required],
      username: ['', Validators.required],
      birthdate: ['', [Validators.required, this.ageValidator]]
    }, { validator: this.passwordMatchValidator });

    if (typeof localStorage !== 'undefined') {
      const savedUsers = localStorage.getItem('users');
      this.users = savedUsers ? JSON.parse(savedUsers) : [];
    }
  }

  ngOnInit(): void { }

  togglePasswordVisibility(field: 'password' | 'repeatPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showRepeatPassword = !this.showRepeatPassword;
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('repeatPassword')?.value ? null : { mismatch: true };
  }

  ageValidator(control: any) {
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 16 ? null : { underage: true };
  }

  userSignIn(email: string, name: string, password: string, username: string, birthdate: string): boolean {
    const existingUser = this.users.find(user => user.email === email || user.username === username);
    if (existingUser) {
      this.showErrorToast('User already exists. Please login.');
      return false;
    }

    const newUser = { email, name, password, username, birthdate };
    this.users.push(newUser);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
    this.showSuccessToast('User registered successfully.');
    return true;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      const { email, name, password, username, birthdate } = this.registerForm.value;
      const registroExitoso = this.userSignIn(email, name, password, username, birthdate);
      if (registroExitoso) {
        this.registerForm.reset();
        this.submitted = false;
      }
    }
  }

  showSuccessToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    this.toastType = 'Success';
    this.toastClass = this.toastClasses[1];
    setTimeout(() => this.showToast = false, 3000);
  }

  showErrorToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    this.toastType = 'Error';
    this.toastClass = this.toastClasses[0];
    setTimeout(() => this.showToast = false, 3000);
  }
}