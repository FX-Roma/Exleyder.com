import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewComponent } from '../../components/overview/overview';
import { ProjectsComponent } from '../../components/projects/projects';
import { ContactComponent } from '../../components/contact/contact';
import { SkillsComponent } from '../../components/skills/skills';
import { StudiesComponent } from '../../components/studies/studies';
import { Footer } from '../../components/footer/footer';
@Component({
  imports: [
      CommonModule,
      OverviewComponent,
      ProjectsComponent,
      StudiesComponent,
      SkillsComponent,
      ContactComponent,
      Footer

    ],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class HomeComponent {}
