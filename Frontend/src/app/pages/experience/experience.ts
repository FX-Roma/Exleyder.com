// ARCHIVO: src/app/pages/experience/experience.ts

import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importación desde la ubicación oficial de modelos
import { Project, PROJECTS_DATA } from '../../models/project-cards.model';

// Importación del componente Standalone de tarjetas de proyecto
import { ProjectCardsComponent } from '../../ObjectsForComponents/projects/project-cards/project-cards';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, FormsModule, ProjectCardsComponent],
  templateUrl: './experience.html',
  styleUrl: './experience.css'
})
export class ExperienceComponent {
  // Control de Pasos (1: Overview, 2: Catalog, 3: Trajectory)
  public currentStep = signal<number>(1);

  // Datos de Proyectos
  public projectsList = signal<Project[]>(PROJECTS_DATA);
  public searchQuery = signal<string>('');
  public selectedCategory = signal<string>('all');
  public activeProjectIndex = signal<number>(0);

  public categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'api', label: 'API & Backend' }
  ];

  // Proyectos filtrados dinámicamente según búsqueda y categoría
  public filteredProjects = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();

    return this.projectsList().filter((project: Project) => {
      const matchesCategory = category === 'all' || project.filterCategory === category;
      const matchesTitle = project.title.toLowerCase().includes(query);
      
      // Tipado explícito (tech: string) para resolver el error TS7006
      const matchesTech = project.technologies.some((tech: string) =>
        tech.toLowerCase().includes(query)
      );

      return matchesCategory && (matchesTitle || matchesTech);
    });
  });

  // Proyecto actual visible en el Stepper estilo Apple
  public currentProject = computed(() => {
    const list = this.filteredProjects();
    if (list.length === 0) return null;
    const index = this.activeProjectIndex();
    return list[index] || list[0];
  });

  public setStep(step: number): void {
    this.currentStep.set(step);
  }

  public filterCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.activeProjectIndex.set(0); // Reinicia el stepper al primer elemento
  }

  public nextProject(): void {
    const total = this.filteredProjects().length;
    if (total === 0) return;
    this.activeProjectIndex.update(idx => (idx + 1) % total);
  }

  public prevProject(): void {
    const total = this.filteredProjects().length;
    if (total === 0) return;
    this.activeProjectIndex.update(idx => (idx - 1 + total) % total);
  }
}