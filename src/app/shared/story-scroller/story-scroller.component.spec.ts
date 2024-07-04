import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryScrollerComponent } from './story-scroller.component';

describe('StoryScrollerComponent', () => {
  let component: StoryScrollerComponent;
  let fixture: ComponentFixture<StoryScrollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryScrollerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
