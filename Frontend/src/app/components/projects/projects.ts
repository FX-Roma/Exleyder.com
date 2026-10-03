import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectCardsComponent } from '../../ObjectsForComponents/projects/project-cards/project-cards';
import { Project, PROJECTS_DATA } from '../../ObjectsForComponents/projects/project-cards/project-cards.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ProjectCardsComponent],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsComponent {
  public projects: Project[] = PROJECTS_DATA;
  public selectedCategory: string = 'all';
  public searchQuery: string = '';
  public isExploreMode: boolean = false;

  public categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'api', label: 'REST APIs' }
  ];

  public toggleExploreMode(): void {
    this.isExploreMode = !this.isExploreMode;
  }

  public filterCategory(catId: string): void {
    this.selectedCategory = catId;
  }

  public get filteredProjects(): Project[] {
    return this.projects.filter(project => {
      const matchesCategory = this.selectedCategory === 'all' || project.filterCategory === this.selectedCategory;
      const matchesSearch = project.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            project.technologies.some(tech => tech.toLowerCase().includes(this.searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }
}