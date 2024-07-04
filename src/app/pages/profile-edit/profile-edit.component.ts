import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDataService } from '../../services/userdata.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  showToast = false;
  toastMessage = '';
  toastType = '';
  toastClasses: string[] = ['bg-danger-subtle', 'bg-success-subtle'];
  toastClass = '';
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      birthdate: ['', Validators.required],
      password: [''],
      title: [''],
      description: ['', Validators.maxLength(300)]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userDataService.getUserDataByToken(token).subscribe(
        user => {
          if (user) {
            this.currentUser = user;
            this.profileForm.patchValue({
              username: user.username,
              email: user.email,
              name: user.name,
              birthdate: user.birthdate,
              title: user['profile-info'].title,
              description: user['profile-info'].description
            });
          }
        },
        error => {
          this.showErrorToast('Error loading user data: ' + error);
        }
      );
    }
  }

  onSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      const formValue = this.profileForm.value;
      const updatedUser: Partial<User> = {
        ...this.currentUser,
        username: formValue.username,
        email: formValue.email,
        name: formValue.name,
        birthdate: formValue.birthdate,
        'profile-info': {
          ...this.currentUser['profile-info'],
          title: formValue.title,
          description: formValue.description
        }
      };

      if (formValue.password) {
        updatedUser.password = formValue.password;
      }

      this.userDataService.updateUserData(updatedUser).subscribe(
        (updatedUser) => {
          if (updatedUser) {
            this.showSuccessToast('Profile updated successfully');
            setTimeout(() => this.router.navigate(['/feed']), 3000);
          } else {
            this.showErrorToast('Error updating profile');
          }
        },
        error => {
          this.showErrorToast('Error updating profile: ' + error.message);
        }
      );
    } else {
      this.showErrorToast('Please fill all required fields correctly');
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