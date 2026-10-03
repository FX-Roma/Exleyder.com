import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from './project-cards.model';

@Component({
  selector: 'app-project-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-cards.html',
  styleUrl: './project-cards.css'
})
export class ProjectCardsComponent {
  @Input() projects: Project[] = [];
  public activeProjectModal: Project | null = null;

  public openArchitectureModal(project: Project): void {
    this.activeProjectModal = project;
  }

  public closeModal(): void {
    this.activeProjectModal = null;
  }
}