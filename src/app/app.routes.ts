import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { MyEventsComponent } from './components/my-events/my-events';
import { PublicEventsComponent } from './components/public-events/public-events';
import { EventFormComponent } from './components/event-form/event-form';
import { AuthGuard } from './guards/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: '/public-events', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'public-events', component: PublicEventsComponent },
  { path: 'my-events', component: MyEventsComponent, canActivate: [AuthGuard] },
  { path: 'event-form', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'event-form/:id', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/public-events' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
