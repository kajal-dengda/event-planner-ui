export interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  maxRsvpCount: number;
  currentRsvpCount: number;
  createdBy: string;
  createdAt: string;
  rsvpUsers: string[];
}

export interface CreateEventDto {
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  maxRsvpCount: number;
}