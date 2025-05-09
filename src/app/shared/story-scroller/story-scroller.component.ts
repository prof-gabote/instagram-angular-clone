import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/userdata.service';

@Component({
  selector: 'app-story-scroller',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './story-scroller.component.html',
  styleUrl: './story-scroller.component.css'
})
export class StoryScrollerComponent implements OnInit {
  posts: Post[] = [];
  user: User | null = null;

  constructor(
    private userService: UserService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.postService.getUserPosts().subscribe(
      (posts) => this.posts = posts
    );
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
}