import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, CreateEventDto } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5107/api/events';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getMyEvents(username: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/my-events/${username}`);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  createEvent(username: string, eventDto: CreateEventDto): Observable<Event> {
    debugger;
    return this.http.post<Event>(`${this.apiUrl}/${username}`, eventDto);
  }

  updateEvent(id: number, username: string, eventDto: CreateEventDto): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}/${username}`, eventDto);
  }

  deleteEvent(id: number, username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/${username}`);
  }

  rsvpToEvent(eventId: number, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/rsvp/${username}`, {});
  }

  getRsvpStatus(eventId: number, username: string): Observable<{ hasRsvped: boolean }> {
    return this.http.get<{ hasRsvped: boolean }>(`${this.apiUrl}/${eventId}/rsvp-status/${username}`);
  }
}