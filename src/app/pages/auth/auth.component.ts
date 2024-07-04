import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PhoneFrameComponent } from '../../shared/phone-frame/phone-frame.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FooterComponent, RouterModule, PhoneFrameComponent, CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class AuthComponent {

  constructor(private router: Router) { }

  get isLoginRoute(): boolean {
    return this.router.url === '/auth/login';
  }

}
