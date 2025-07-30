import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { EventService } from '../../services/event';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-my-events',
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>My Events</h2>
      <button class="btn btn-primary" routerLink="/event-form">Create New Event</button>
    </div>

    <div *ngIf="events.length === 0" class="alert alert-info">
      <h4>No events created yet</h4>
      <p>Create your first event to get started!</p>
    </div>

    <div class="row">
      <div class="col-md-6 mb-3" *ngFor="let event of events">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{event.name}}</h5>
            <div>
              <button class="btn btn-sm btn-outline-primary me-2" 
                      (click)="editEvent(event.id)">Edit</button>
              <button class="btn btn-sm btn-outline-danger" 
                      (click)="deleteEvent(event.id)">Delete</button>
            </div>
          </div>
          <div class="card-body">
            <p><strong>Date:</strong> {{formatDate(event.date)}}</p>
            <p><strong>Time:</strong> {{event.time}}</p>
            <p><strong>Location:</strong> {{event.location}}</p>
            <p><strong>Description:</strong> {{event.description}}</p>
            <p><strong>RSVPs:</strong> {{event.currentRsvpCount}} / {{event.maxRsvpCount}}</p>
            
            <div *ngIf="event.rsvpUsers.length > 0">
              <strong>RSVP'd Users:</strong>
              <ul class="list-unstyled">
                <li *ngFor="let user of event.rsvpUsers">• {{user}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MyEventsComponent implements OnInit {
  events: Event[] = [];
  currentUser: string | null = null;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadMyEvents();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadMyEvents() {
    if (this.currentUser) {
      this.eventService.getMyEvents(this.currentUser).subscribe({
        next: (events) => {
          this.events = events;
        },
        error: (error) => {
          console.error('Error loading events:', error);
        }
      });
    }
  }

  editEvent(eventId: number) {
    this.router.navigate(['/event-form', eventId]);
  }

  deleteEvent(eventId: number) {
    if (confirm('Are you sure you want to delete this event?')) {
      if (this.currentUser) {
        this.eventService.deleteEvent(eventId, this.currentUser).subscribe({
          next: () => {
            this.loadMyEvents(); // Refresh the list
          },
          error: (error) => {
            console.error('Error deleting event:', error);
            alert('Error deleting event. Please try again.');
          }
        });
      }
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}