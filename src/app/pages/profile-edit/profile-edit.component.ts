import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/userdata.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { User } from '../../models/user.model';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';


@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  showToast = false;
  toastMessage = '';
  toastType = '';
  toastClass = '';
  currentUser: User | null = null;
  selectedFile: File | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      birthdate: ['', Validators.required],
      title: [''],
      description: ['', Validators.maxLength(300)]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserData() {
    if (this.authService.isAuthenticated()) {
      this.userService.getProfile().pipe(
        catchError(error => {
          this.showErrorToast('Error loading user data: ' + error.message);
          return of(null);
        }),
        takeUntil(this.destroy$)
      ).subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.profileForm.patchValue({
            username: user.username,
            email: user.email,
            name: user.name,
            birthdate: user.profileInfo?.birthdate,
            title: user.profileInfo?.title,
            description: user.profileInfo?.description
          });
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      const formValue = this.profileForm.value;
      const updatedUser: Partial<User> = {
        username: formValue.username,
        email: formValue.email,
        name: formValue.name,
        profileInfo: {
          birthdate: formValue.birthdate,
          title: formValue.title,
          description: formValue.description
        }
      };

      let updateObservable = this.userService.updateProfile(updatedUser);

      if (this.selectedFile) {
        updateObservable = this.userService.uploadProfilePic(this.selectedFile).pipe(
          switchMap(response => this.userService.updateProfilePicUrl(response.profilePicUrl)),
          switchMap(() => this.userService.updateProfile(updatedUser))
        );
      }

      updateObservable.pipe(
        catchError(error => {
          this.showErrorToast('Error updating profile: ' + error.message);
          return of(null);
        }),
        takeUntil(this.destroy$)
      ).subscribe(updatedUser => {
        if (updatedUser) {
          this.showSuccessToast('Profile updated successfully');
          setTimeout(() => this.router.navigate(['/feed']), 3000);
        } else {
          this.showErrorToast('Error updating profile');
        }
      });
    } else {
      this.showErrorToast('Please fill all required fields correctly');
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  uploadProfilePic() {
    if (this.selectedFile) {
      this.userService.uploadProfilePic(this.selectedFile).pipe(
        switchMap(response => this.userService.updateProfilePicUrl(response.profilePicUrl)),
        catchError(error => {
          this.showErrorToast('Error uploading profile picture: ' + error.message);
          return of(null);
        }),
        takeUntil(this.destroy$)
      ).subscribe(updatedUser => {
        if (updatedUser) {
          this.currentUser = updatedUser;
          this.showSuccessToast('Profile picture updated successfully');
        }
      });
    } else {
      this.showErrorToast('Please select a file first');
    }
  }

  goBack() {
    this.router.navigate(['/feed']);
  }
  
}