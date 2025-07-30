import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
     <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <h2 class="text-center">Event Planner</h2>
        
        <div class="navbar-nav ms-auto" *ngIf="currentUser">
          <span class="navbar-text me-3">Welcome, {{currentUser}}!</span>
          <a class="nav-link" routerLink="/my-events">My Events</a>
          <a class="nav-link" routerLink="/public-events">Public Events</a>
          <button class="btn btn-outline-light btn-sm" (click)="logout()">Logout</button>
        </div>
        
        <div class="navbar-nav ms-auto" *ngIf="!currentUser">
          <a class="nav-link" routerLink="/login">Login</a>
        </div>
      </div>
    </nav>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  currentUser: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
