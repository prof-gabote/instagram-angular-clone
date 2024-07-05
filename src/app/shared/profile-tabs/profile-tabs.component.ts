import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/userdata.service';
import { User } from '../../models/user.model';

import type { Modal } from 'bootstrap';

@Component({
  selector: 'app-profile-tabs',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.css']
})
export class ProfileTabsComponent implements OnInit {
  activeTab: string = 'posts';
  user: User | null = null;
  private deleteModal: Modal | null = null;
  private postToDelete: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserProfile();
    if (this.isBrowser()) {
      this.initializeModal();
    }
  }

  loadUserProfile() {
    this.userService.getProfile().subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  initializeModal() {
    const modalElement = document.getElementById('deleteConfirmModal');
    if (modalElement) {
      import('bootstrap').then(bootstrap => {
        this.deleteModal = new bootstrap.Modal(modalElement);
      });
    }
  }

  openDeleteModal(photoUrl: string) {
    this.postToDelete = photoUrl;
    if (this.isBrowser()) {
      this.deleteModal?.show();
    }
  }

  confirmDelete() {
    if (this.postToDelete) {
      this.userService.deletePostPhoto(this.postToDelete).subscribe(
        (response) => {
          console.log(response.message);
          if (this.user) {
            this.user.postPhotos = this.user.postPhotos.filter(url => url !== this.postToDelete);
          }
          if (this.isBrowser()) {
            this.deleteModal?.hide();
          }
        },
        (error) => {
          console.error('Error deleting post:', error);
          if (this.isBrowser()) {
            this.deleteModal?.hide();
          }
        }
      );
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}