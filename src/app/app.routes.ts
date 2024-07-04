import { Routes } from '@angular/router';
import { FeedComponent } from './pages/feed/feed.component';
import { LoginComponent } from './pages/components/login/login.component';
import { RegisterComponent } from './pages/components/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
   { path: 'feed', component: FeedComponent, canActivate: [authGuard] },
   { path: 'login', component: LoginComponent},
   { path: 'register', component: RegisterComponent},
   { path: '', redirectTo: '/feed', pathMatch: 'full' }
];
