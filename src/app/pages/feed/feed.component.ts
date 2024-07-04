import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { StoryScrollerComponent } from '../../shared/story-scroller/story-scroller.component';
import { ProfileTabsComponent } from '../../shared/profile-tabs/profile-tabs.component';
import { UserDataService } from '../../services/userdata.service';
import { User } from '../../models/user.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [NavbarComponent, StoryScrollerComponent, ProfileTabsComponent, RouterModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit {

  private userDataService: UserDataService = inject(UserDataService);
  public userData: User | undefined;

  constructor() { }

  ngOnInit() {
    const token = localStorage.getItem('token') || '';

    this.userDataService.getUserDataByToken(token).subscribe((user: User | undefined) => {
      if (user) {
        this.userData = user;
      } else {
        console.log('No user data found');
      }
    }
    );

  }

}
