import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyItem, STUDIES_DATA, StudyType } from '../../models/studies.model';

@Component({
  selector: 'app-studies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './studies.html',
  styleUrl: './studies.css'
})
export class StudiesComponent {
  public studiesList: StudyItem[] = STUDIES_DATA;
  public activeFilter: string = 'all';

  public filterOptions = [
    { id: 'all', label: 'ALL' },
    { id: 'academic', label: 'ACADEMIC LEARNING' },
    { id: 'autonomous', label: 'AUTONOMOUS LEARNING' },
    { id: 'certification', label: 'CERTIFICATIONS' }
  ];

  public setFilter(filterId: string): void {
    this.activeFilter = filterId;
  }

  public get filteredStudies(): StudyItem[] {
    if (this.activeFilter === 'all') return this.studiesList;

    return this.studiesList.filter(item => {
      if (Array.isArray(item.type)) {
        return item.type.includes(this.activeFilter as StudyType);
      }
      return item.type === this.activeFilter;
    });
  }

  // Normaliza el tipo a un arreglo para simplificar el *ngFor en la plantilla HTML
  public getItemTypes(type: StudyType | StudyType[]): StudyType[] {
    return Array.isArray(type) ? type : [type];
  }
}