import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LoginDto } from '../../models/user.model';

@Component({
  selector: 'app-login',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Login</h3>
          </div>
          <div class="card-body">
            <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="username" 
                  name="username"
                  [(ngModel)]="loginDto.username" 
                  required
                  #username="ngModel">
                <div *ngIf="username.invalid && username.touched" class="text-danger">
                  Username is required
                </div>
              </div>
              
              <div *ngIf="errorMessage" class="alert alert-danger">
                {{errorMessage}}
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary w-100" 
                [disabled]="loginForm.invalid || isLoading">
                {{isLoading ? 'Logging in...' : 'Login'}}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginDto: LoginDto = { username: '' };
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginDto.username.trim()) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginDto).subscribe({
        next: (response) => {
          this.authService.setCurrentUser(this.loginDto.username);
          this.router.navigate(['/public-events']);
        },
        error: (error) => {
          this.errorMessage = 'Login failed. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
