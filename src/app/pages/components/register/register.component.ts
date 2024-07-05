import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/userdata.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  toastClass = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
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

      const newUser: User = {
        username,
        email,
        name,
        password,
        profileInfo: {
          birthdate,
          title: `${name}'s Profile`,
          description: `Welcome to ${name}'s profile!`,
        },
        profilePicUrl: '/assets/default-profile-pic.png',
        followers: '0',
        following: '0',
        postPhotos: [""],
        token: ""
      };

      this.userService.register(newUser).pipe(
        catchError(error => {
          this.showErrorToast('Error registering user: ' + error.message);
          return of(null);
        })
      ).subscribe(
        response => {
          if (response && response.token) {
            this.showSuccessToast('User registered successfully.');
            this.authService.setToken(response.token);
            this.registerForm.reset();
            this.submitted = false;
            setTimeout(() => this.router.navigate(['/feed']), 3000);
          }
        }
      );
    }
  }


  showSuccessToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    this.toastType = 'Success';
    this.toastClass = 'bg-success-subtle';
    setTimeout(() => this.showToast = false, 3000);
  }

  showErrorToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    this.toastType = 'Error';
    this.toastClass = 'bg-danger-subtle';
    setTimeout(() => this.showToast = false, 3000);
  }
}