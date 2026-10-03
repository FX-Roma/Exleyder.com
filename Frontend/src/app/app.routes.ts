import { Routes } from '@angular/router';
import { OverviewComponent } from './components/overview/overview';
import { ProjectsComponent } from './components/projects/projects';
import { SkillsComponent } from './components/skills/skills';
import { ContactComponent } from './components/contact/contact';
import {  StudiesComponent } from './components/studies/studies';

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'studies', component: StudiesComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: 'overview' }
];