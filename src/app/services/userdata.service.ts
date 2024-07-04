import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer b9387a03-0629-495a-bb96-6b18a1aed0d6'
    })
  };

  private url = "/api/v0/b/instagram-clone-c2691.appspot.com/o/user-resources%2Fuser-resources.json?alt=media&token=b9387a03-0629-495a-bb96-6b18a1aed0d6"

  constructor(private http: HttpClient) { }

  getUserData(): Observable<User[]> {
    return this.http.get<User[]>(this.url).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response;
        } else if (typeof response === 'object' && response !== null) {
          return Object.values(response) as User[];
        } else {
          console.warn('No users found or unexpected response format. Initializing with empty array.');
          return [] as User[];
        }
      }),
      catchError(error => {
        console.error('Error fetching user data:', error);
        return of([] as User[]);
      })
    );
  }

  getUserDataByUsername(username: string): Observable<User | undefined> {
    return this.getUserData().pipe(
      map(users => {
        if (!Array.isArray(users)) {
          console.error('Expected users to be an array, got:', users);
          return undefined;
        }
        return users.find(user => user.username === username);
      })
    );
  }

  getUserDataByEmail(email: string): Observable<User | undefined> {
    return this.getUserData().pipe(
      map(users => {
        if (!Array.isArray(users)) {
          console.error('Expected users to be an array, got:', users);
          return undefined;
        }
        return users.find(user => user.email === email);
      })
    );
  }

  getUserDataByToken(token: string): Observable<User | undefined> {
    return this.getUserData().pipe(
      map(users => {
        if (!Array.isArray(users)) {
          console.error('Expected users to be an array, got:', users);
          return undefined;
        }
        return users.find(user => user.token === token);
      })
    );
  }

  updateUserData(updatedUserData: Partial<User>): Observable<User | undefined> {
    return this.getUserData().pipe(
      map(users => {
        if (!Array.isArray(users)) {
          throw new Error('Invalid user data format');
        }
        const userIndex = users.findIndex(u => u.token === updatedUserData.token);
        if (userIndex === -1) {
          throw new Error('User not found');
        }
        users[userIndex] = { ...users[userIndex], ...updatedUserData };
        return users;
      }),
      switchMap(updatedUsers => {
        return this.http.post(this.url, updatedUsers, this.httpOptions).pipe(
          map(() => {
            console.log('JSON file updated successfully');
            return updatedUsers.find(u => u.token === updatedUserData.token);
          }),
          catchError(error => {
            console.error('Error updating JSON file:', error);
            throw error;
          })
        );
      })
    );
  }

  updateAllUserData(users: User[]): Observable<User[]> {
    return this.http.post<User[]>(this.url, users, this.httpOptions).pipe(
      map(() => {
        console.log('Archivo JSON sobrescrito con éxito');
        return users;
      }),
      catchError(error => {
        console.error('Error al sobrescribir el archivo JSON:', error);
        throw error;
      })
    );
  }
}