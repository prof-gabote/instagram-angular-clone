import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-post-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-upload.component.html',
  styleUrls: ['./post-upload.component.css']
})
export class PostUploadComponent {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  description: string = '';
  showToast = false;
  toastMessage = '';
  toastType = '';
  toastClass = '';

  constructor(private postService: PostService) {}

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
    if (this.selectedFile && this.description.trim()) {
      this.postService.uploadNewPost(this.selectedFile, this.description).pipe(
        catchError(error => {
          this.showErrorToast('Error uploading post: ' + error.message);
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          this.showSuccessToast('Photo uploaded successfully');
          setTimeout(() => this.closeModal(), 3000);
        }
      });
    } else {
      this.showErrorToast('Please select an image and write a description');
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
