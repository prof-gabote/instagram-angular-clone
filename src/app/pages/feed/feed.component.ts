import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { StoryScrollerComponent } from '../../shared/story-scroller/story-scroller.component';
import { ProfileTabsComponent } from '../../shared/profile-tabs/profile-tabs.component';
import { UserService } from '../../services/userdata.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Router, RouterModule } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent, 
    StoryScrollerComponent, 
    ProfileTabsComponent, 
    RouterModule
  ],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  userData: User | null = null;

  constructor(
      @Inject(UserService) private userService: UserService,
      private authService: AuthService,
      private router: Router
    ) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.loadUserProfile();
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  loadUserProfile() {
    this.userService.getProfile().pipe(
      catchError(error => {
        console.error('Error loading user profile:', error);
        this.router.navigate(['/auth/login']);
        return of(null);
      })
    ).subscribe((user: User | null) => {
      if (user) {
        this.userData = user;
      }
    });
  }

  getPostCount(): number {
    return this.userData?.postPhotos?.length || 0;
  }

  getFollowersCount(): number {
    return this.userData?.followers ? parseInt(String(this.userData.followers)) : 0;
  }

  getFollowingCount(): number {
    return this.userData?.following ? parseInt(String(this.userData.following)) : 0;
  }
}