import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';
import { EventService } from '../../services/event';
import { CreateEventDto, Event } from '../../models/event.model';

@Component({
  selector: 'app-event-form',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3>{{isEditMode ? 'Edit Event' : 'Create New Event'}}</h3>
          </div>
          <div class="card-body">
            <form (ngSubmit)="onSubmit()" #eventForm="ngForm">
              <div class="mb-3">
                <label for="name" class="form-label">Event Name *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="name" 
                  name="name"
                  [(ngModel)]="eventDto.name" 
                  required
                  #name="ngModel">
                <div *ngIf="name.invalid && name.touched" class="text-danger">
                  Event name is required
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="date" class="form-label">Date *</label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="date" 
                      name="date"
                      [(ngModel)]="eventDto.date" 
                      required
                      #date="ngModel">
                    <div *ngIf="date.invalid && date.touched" class="text-danger">
                      Date is required
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="time" class="form-label">Time *</label>
                    <input 
                      type="time" 
                      class="form-control" 
                      id="time" 
                      name="time"
                      [(ngModel)]="eventDto.time" 
                      required
                      #time="ngModel">
                    <div *ngIf="time.invalid && time.touched" class="text-danger">
                      Time is required
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="location" class="form-label">Location *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="location" 
                  name="location"
                  [(ngModel)]="eventDto.location" 
                  required
                  #location="ngModel">
                <div *ngIf="location.invalid && location.touched" class="text-danger">
                  Location is required
                </div>
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea 
                  class="form-control" 
                  id="description" 
                  name="description"
                  rows="4"
                  [(ngModel)]="eventDto.description">
                </textarea>
              </div>

              <div class="mb-3">
                <label for="maxRsvpCount" class="form-label">Maximum RSVP Count *</label>
                <input 
                  type="number" 
                  class="form-control" 
                  id="maxRsvpCount" 
                  name="maxRsvpCount"
                  [(ngModel)]="eventDto.maxRsvpCount" 
                  required
                  min="1"
                  #maxRsvpCount="ngModel">
                <div *ngIf="maxRsvpCount.invalid && maxRsvpCount.touched" class="text-danger">
                  Maximum RSVP count is required and must be at least 1
                </div>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger">
                {{errorMessage}}
              </div>

              <div class="d-flex gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  [disabled]="eventForm.invalid || isLoading">
                  {{isLoading ? 'Saving...' : (isEditMode ? 'Update Event' : 'Create Event')}}
                </button>
                
                <button 
                  type="button" 
                  class="btn btn-secondary" 
                  (click)="cancel()">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EventFormComponent implements OnInit {
  eventDto: CreateEventDto = {
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    maxRsvpCount: 1
  };
  
  isEditMode: boolean = false;
  eventId: number | null = null;
  currentUser: string | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.eventId = +params['id'];
        this.loadEvent();
      }
    });
  }

  loadEvent() {
    if (this.eventId) {
      this.eventService.getEventById(this.eventId).subscribe({
        next: (event) => {
          // Check if current user is the creator
          if (event.createdBy !== this.currentUser) {
            alert('You can only edit events you created.');
            this.router.navigate(['/my-events']);
            return;
          }

          this.eventDto = {
            name: event.name,
            date: event.date.split('T')[0], // Extract date part
            time: event.time,
            location: event.location,
            description: event.description,
            maxRsvpCount: event.maxRsvpCount
          };
        },
        error: (error) => {
          console.error('Error loading event:', error);
          this.router.navigate(['/my-events']);
        }
      });
    }
  }

  onSubmit() {
    if (this.currentUser) {
      this.isLoading = true;
      this.errorMessage = '';
      if (this.eventDto.time && /^\d{2}:\d{2}$/.test(this.eventDto.time)) {
         this.eventDto.time = `${this.eventDto.time}:00`;
      }
      const operation = this.isEditMode && this.eventId
        ? this.eventService.updateEvent(this.eventId, this.currentUser, this.eventDto)
        : this.eventService.createEvent(this.currentUser, this.eventDto);

      operation.subscribe({
        next: (response) => {
          this.router.navigate(['/my-events']);
        },
        error: (error) => {
          this.errorMessage = 'Error saving event. Please try again.';
          this.isLoading = false;
          console.error('Error saving event:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/my-events']);
  }
}
