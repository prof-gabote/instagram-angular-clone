import { Component } from '@angular/core';
import {NgFor, NgIf} from '@angular/common';

@Component({
  selector: 'app-profile-tabs',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.css']
})
export class ProfileTabsComponent {
  activeTab: string = 'posts';

  posts = [
    { id: 1, imageUrl: '/img/feed/stories/story_1.png' },
    { id: 2, imageUrl: '/img/feed/stories/story_2.png' },
    { id: 3, imageUrl: '/img/feed/stories/story_3.png' },
    { id: 1, imageUrl: '/img/feed/stories/story_4.png' },
    { id: 2, imageUrl: '/img/feed/stories/story_5.png' },
    { id: 1, imageUrl: '/img/feed/stories/story_6.png' },
  ];

  reels = [
    { id: 1, imageUrl: '/img/feed/stories/story_4.png' },
    { id: 2, imageUrl: '/img/feed/stories/story_5.png' },
  ];

  tagged = [
    { id: 1, imageUrl: '/img/feed/stories/story_6.png' },
  ];

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

}
