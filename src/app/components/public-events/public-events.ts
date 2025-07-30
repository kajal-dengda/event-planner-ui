import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { EventService } from '../../services/event';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-public-events',
  template: `
    <h2>Public Events</h2>

    <div *ngIf="events.length === 0" class="alert alert-info">
      <h4>No public events</h4>
      <p>Check back later for new events!</p>
    </div>

    <div class="row">
      <div class="col-md-6 mb-3" *ngFor="let event of events">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">{{event.name}}</h5>
            <small class="text-muted">Created by: {{event.createdBy}}</small>
          </div>
          <div class="card-body">
            <p><strong>Date:</strong> {{formatDate(event.date)}}</p>
            <p><strong>Time:</strong> {{event.time}}</p>
            <p><strong>Location:</strong> {{event.location}}</p>
            <p><strong>Description:</strong> {{event.description}}</p>
            
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge" 
                    [class]="event.currentRsvpCount >= event.maxRsvpCount ? 'bg-danger' : 'bg-success'">
                {{event.currentRsvpCount}} / {{event.maxRsvpCount}} RSVPs
              </span>
              
              <div *ngIf="!isLoggedIn">
                <small class="text-muted">Log in to RSVP</small>
              </div>
              
              <div *ngIf="isLoggedIn">
                <button 
                  *ngIf="!hasUserRsvped(event.id) && event.currentRsvpCount < event.maxRsvpCount"
                  class="btn btn-primary btn-sm"
                  (click)="rsvpToEvent(event.id)"
                  [disabled]="isRsvping">
                  {{isRsvping ? 'RSVPing...' : 'RSVP'}}
                </button>
                
                <button 
                  *ngIf="hasUserRsvped(event.id)"
                  class="btn btn-success btn-sm"
                  disabled>
                  RSVP'd!
                </button>
                
                <button 
                  *ngIf="event.currentRsvpCount >= event.maxRsvpCount && !hasUserRsvped(event.id)"
                  class="btn btn-secondary btn-sm"
                  disabled>
                  Event Full
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PublicEventsComponent implements OnInit {
  events: Event[] = [];
  isLoggedIn: boolean = false;
  currentUser: string | null = null;
  userRsvpStatus: { [eventId: number]: boolean } = {};
  isRsvping: boolean = false;

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      this.loadEvents();
    });
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        if (this.isLoggedIn && this.currentUser) {
          this.loadRsvpStatuses();
        }
      },
      error: (error) => {
        console.error('Error loading events:', error);
      }
    });
  }

  loadRsvpStatuses() {
    if (this.currentUser) {
      this.events.forEach(event => {
        this.eventService.getRsvpStatus(event.id, this.currentUser!).subscribe({
          next: (response) => {
            this.userRsvpStatus[event.id] = response.hasRsvped;
          },
          error: (error) => {
            console.error('Error loading RSVP status:', error);
          }
        });
      });
    }
  }

  hasUserRsvped(eventId: number): boolean {
    return this.userRsvpStatus[eventId] || false;
  }

  rsvpToEvent(eventId: number) {
    if (this.currentUser) {
      this.isRsvping = true;
      this.eventService.rsvpToEvent(eventId, this.currentUser).subscribe({
        next: (response) => {
          this.userRsvpStatus[eventId] = true;
          this.loadEvents(); // Refresh to update RSVP count
        },
        error: (error) => {
          console.error('Error RSVPing to event:', error);
          alert('Error RSVPing to event. Please try again.');
        },
        complete: () => {
          this.isRsvping = false;
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}