import { Routes } from '@angular/router';
import { ProjectsComponent } from './components/projects/projects';
import { SkillsComponent } from './components/skills/skills';
import { ContactComponent } from './components/contact/contact';
import {  StudiesComponent } from './components/studies/studies';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'studies', component: StudiesComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: 'home' }
];