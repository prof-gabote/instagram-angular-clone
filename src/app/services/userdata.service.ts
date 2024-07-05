import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  login(userOrEmail: string, password: string): Observable<{ message: string, token: string }> {
    return this.http.post<{ message: string, token: string }>(`${this.apiUrl}/login`, { userOrEmail, password });
  }

  register(user: User): Observable<{ message: string, token: string }> {
    return this.http.post<{ message: string, token: string }>(`${this.apiUrl}/register`, user);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`, { headers: this.getHeaders() });
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, userData, { headers: this.getHeaders() });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/change-password`, { oldPassword, newPassword }, { headers: this.getHeaders() });
  }

  uploadProfilePic(file: File): Observable<{ message: string, profilePicUrl: string }> {
    const formData = new FormData();
    formData.append('profilePic', file);
    return this.http.post<{ message: string, profilePicUrl: string }>(
      `${this.apiUrl}/upload-profile-pic`,
      formData,
      { headers: this.getHeaders() }
    );
  }

  uploadPostPhoto(file: File): Observable<{ message: string, postPhotoUrl: string }> {
    const formData = new FormData();
    formData.append('postPhoto', file);
    return this.http.post<{ message: string, postPhotoUrl: string }>(
      `${this.apiUrl}/upload-post-photo`,
      formData,
      { headers: this.getHeaders() }
    );
  }

  deleteProfile(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/profile`, { headers: this.getHeaders() });
  }

  updateProfilePicUrl(profilePicUrl: string): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/profile`,
      { profilePicUrl },
      { headers: this.getHeaders() }
    );
  }

  deletePostPhoto(photoUrl: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/delete-post-photo`,
      { 
        headers: this.getHeaders(),
        body: { photoUrl }
      }
    );
  }
}