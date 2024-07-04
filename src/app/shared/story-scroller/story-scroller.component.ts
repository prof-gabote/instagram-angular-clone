import { Component } from '@angular/core';
import {NgFor} from '@angular/common';

interface SavedStory {
  id: number;
  title: string;
  imageUrl: string;
}

@Component({
  selector: 'app-story-scroller',
  standalone: true,
  imports: [NgFor],
  templateUrl: './story-scroller.component.html',
  styleUrl: './story-scroller.component.css'
})
export class StoryScrollerComponent {
  
  stories: SavedStory[] = [
    { id: 1, title: 'Feel like music', imageUrl: '/img/feed/stories/story_1.png' },
    { id: 2, title: 'Semana santa', imageUrl: '/img/feed/stories/story_2.png' },
    { id: 3, title: 'Pa la chamba', imageUrl: '/img/feed/stories/story_3.png' },
    { id: 4, title: 'Pizzita', imageUrl: '/img/feed/stories/story_4.png' },
    { id: 5, title: 'Pensanding', imageUrl: '/img/feed/stories/story_5.png' },
    { id: 6, title: 'Juebebes', imageUrl: '/img/feed/stories/story_6.png' },
  ];
}
