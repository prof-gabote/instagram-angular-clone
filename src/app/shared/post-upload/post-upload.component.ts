import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/userdata.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-post-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-upload.component.html',
  styleUrls: ['./post-upload.component.css']
})
export class PostUploadComponent {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  showToast = false;
  toastMessage = '';
  toastType = '';
  toastClass = '';

  constructor(private userService: UserService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    this.previewImage();
  }

  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadPost() {
    if (this.selectedFile) {
      this.userService.uploadPostPhoto(this.selectedFile).pipe(
        catchError(error => {
          this.showErrorToast('Error uploading post: ' + error.message);
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          this.showSuccessToast('Photo uploaded successfully');
          setTimeout(() => {
            this.closeModal();
          }, 3000);
        }
      });
    } else {
      this.showErrorToast('Please select an image');
    }
  }

  closeModal() {
    const modalElement = document.getElementById('postUploadModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
        window.location.reload();
      }
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