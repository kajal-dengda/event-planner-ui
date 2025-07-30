import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginDto, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5107/api/auth';
  private currentUserSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('currentUser')
  );
  
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(loginDto: LoginDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginDto);
  }

  setCurrentUser(username: string): void {
    localStorage.setItem('currentUser', username);
    this.currentUserSubject.next(username);
  }

  getCurrentUser(): string | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}