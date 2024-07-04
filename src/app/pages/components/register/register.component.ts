import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserDataService } from '../../../services/userdata.service';
import { User } from '../../../models/user.model';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  showPassword = false;
  showRepeatPassword = false;
  showToast = false;
  toastMessage = '';
  toastType = '';
  toastClasses: string[] = ['bg-danger-subtle', 'bg-success-subtle'];
  toastClass = '';

  constructor(
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      repeatPassword: ['', Validators.required],
      username: ['', Validators.required],
      birthdate: ['', [Validators.required, this.ageValidator]]
    }, { validator: this.passwordMatchValidator });
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

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      const { email, name, password, username, birthdate } = this.registerForm.value;
      
      this.userDataService.getUserData().pipe(
        switchMap(users => {
          const existingUser = users.find(user => user.email === email || user.username === username);
          if (existingUser) {
            this.showErrorToast('User already exists. Please login.');
            return of(null);
          }
  
          const newUser: User = {
            id: (users.length + 1).toString(),
            email,
            name,
            password,
            username,
            birthdate,
            token: this.generateToken(),
            'profile-info': {
              title: `${name}'s Profile`,
              description: `Welcome to ${name}'s profile!`,
              'profile-pic-url': '/assets/default-profile-pic.png',
              posts: '0',
              followers: '0',
              following: '0'
            }
          };
  
          users.push(newUser);
          return this.userDataService.updateAllUserData(users);
        })
      ).subscribe(
        result => {
          if (result) {
            this.showSuccessToast('User registered successfully.');
            this.registerForm.reset();
            this.submitted = false;
            setTimeout(() => this.router.navigate(['/auth/login']), 3000);
          }
        },
        error => {
          this.showErrorToast('Error registering user: ' + error.message);
        }
      );
    }
  }

  generateToken(): string {
    return Math.random().toString(36).substr(2, 16);
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