import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user.model";
import { Injectable } from "@angular/core";
import { environment } from "../../env/enviroment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: { userOrEmail: string, password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials);
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {});
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }
}