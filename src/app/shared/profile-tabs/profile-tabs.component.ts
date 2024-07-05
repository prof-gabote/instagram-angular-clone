import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/userdata.service';
import { User } from '../../models/user.model';

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

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}