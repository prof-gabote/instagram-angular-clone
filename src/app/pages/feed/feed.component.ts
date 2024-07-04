import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { StoryScrollerComponent } from '../../shared/story-scroller/story-scroller.component';
import { ProfileTabsComponent } from '../../shared/profile-tabs/profile-tabs.component';
@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [NavbarComponent, StoryScrollerComponent, ProfileTabsComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {

}
