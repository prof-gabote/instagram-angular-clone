import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/userdata.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-story-scroller',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './story-scroller.component.html',
  styleUrl: './story-scroller.component.css'
})
export class StoryScrollerComponent implements OnInit {
  
  user: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserProfile();
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