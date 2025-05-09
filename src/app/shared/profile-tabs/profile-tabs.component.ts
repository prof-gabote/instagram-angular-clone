import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/userdata.service';
import { PostService } from '../../services/post.service';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';

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
  posts: Post[] = [];

  constructor(
    private userService: UserService,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.loadUserProfile();
    this.loadUserPosts();
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

  openDeleteModal(postId: string) {
    this.postToDelete = postId;
    if (this.isBrowser()) {
      this.deleteModal?.show();
    }
  }

  confirmDelete() {
    if (this.postToDelete) {
      this.postService.deletePostById(this.postToDelete).subscribe(
        () => {
          this.posts = this.posts.filter(p => p.id !== this.postToDelete);
          this.deleteModal?.hide();
        }
      );
    }
  }


  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  loadUserPosts() {
    this.postService.getUserPosts().subscribe(
      posts => this.posts = posts
    );
  }

}