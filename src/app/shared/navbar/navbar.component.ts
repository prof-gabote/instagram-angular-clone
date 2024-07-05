import { Component } from '@angular/core';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostUploadComponent } from '../post-upload/post-upload.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule, PostUploadComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) { }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}