import { Routes } from '@angular/router';
import { ProjectsComponent } from './components/projects/projects';
import { SkillsComponent } from './pages/skills/skills';
import { ContactComponent } from './pages/contact/contact';
import {  StudiesComponent } from './pages/studies/studies';
import { HomeComponent } from './pages/home/home';
import { ExperienceComponent } from './pages/experience/experience';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'studies', component: StudiesComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: 'home' }
];