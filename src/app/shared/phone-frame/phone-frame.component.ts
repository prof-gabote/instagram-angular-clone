import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-phone-frame',
  standalone: true,
  imports: [],
  templateUrl: './phone-frame.component.html',
  styleUrls: ['./phone-frame.component.css']
})
export class PhoneFrameComponent implements OnInit, AfterViewInit {
  ngOnInit() {
  }

  ngAfterViewInit() {
    if (typeof document !== 'undefined') {
      this.initializeSlider();
    }
  }

  initializeSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    slides[currentSlide].classList.add('active');

    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % totalSlides;
      slides[currentSlide].classList.add('active');
    }, 3000);
  }
}
