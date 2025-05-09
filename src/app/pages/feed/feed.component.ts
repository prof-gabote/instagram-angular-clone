import { catchError, of } from "rxjs";
import { Post } from "../../models/post.model";
import { User } from "../../models/user.model";
import { Component, OnInit } from "@angular/core";
import { PostService } from "../../services/post.service";
import { AuthService } from "../../services/auth.service";
import { Router, RouterModule } from "@angular/router";
import { UserService } from "../../services/userdata.service";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { StoryScrollerComponent } from "../../shared/story-scroller/story-scroller.component";
import { ProfileTabsComponent } from "../../shared/profile-tabs/profile-tabs.component";

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,         
    StoryScrollerComponent, 
    ProfileTabsComponent     
  ],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  userData: User | null = null;
  posts: Post[] = []; // <-- sin @Input

  constructor(
    private userService: UserService,
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.loadUserProfile();
      this.loadUserPosts();
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
      this.userData = user;
    });
  }

  loadUserPosts() {
    this.postService.getUserPosts().pipe(
      catchError(error => {
        console.error('Error loading posts:', error);
        return of([]);
      })
    ).subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  getPostCount(): number {
    return this.posts.length;
  }

  getFollowersCount(): number {
    return this.userData?.followers ? parseInt(this.userData.followers) : 0;
  }

  getFollowingCount(): number {
    return this.userData?.following ? parseInt(this.userData.following) : 0;
  }
}
