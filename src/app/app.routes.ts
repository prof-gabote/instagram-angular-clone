import { Routes } from '@angular/router';
import { FeedComponent } from './pages/feed/feed.component';
import { LoginComponent } from './pages/components/login/login.component';
import { RegisterComponent } from './pages/components/register/register.component';
import { AuthComponent } from './pages/auth/auth.component';
import { authGuard } from './guards/auth.guard';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { PostUploadComponent } from './shared/post-upload/post-upload.component';

export const routes: Routes = [
   {
      path: 'auth',
      component: AuthComponent,
      children: [
         {path: 'login', component: LoginComponent},
         {path: 'register', component: RegisterComponent},
         {path: '', redirectTo: 'login', pathMatch: 'full'}
      ]
   },
   { path: 'feed', component: FeedComponent, canActivate: [authGuard] },
   { path: 'profile/edit', component: ProfileEditComponent, canActivate: [authGuard] },
   { path: 'upload-photo', component: PostUploadComponent },
   { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
   
];
