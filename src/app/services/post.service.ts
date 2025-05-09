import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { environment } from '../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/user/posts`, { headers: this.getHeaders() });
  }

  uploadNewPost(file: File, description: string): Observable<{ message: string, post: Post }> {
    const formData = new FormData();
    formData.append('postPhoto', file);
    formData.append('description', description);
    return this.http.post<{ message: string, post: Post }>(
      `${this.apiUrl}/upload-post`,
      formData,
      { headers: this.getHeaders() }
    );
  }

  deletePostById(postId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/posts/${postId}`,
      { headers: this.getHeaders() }
    );
  }
}
