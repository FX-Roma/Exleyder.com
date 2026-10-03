// ARCHIVO: src/app/components/studies/studies.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyItem, STUDIES_DATA } from '../../ObjectsForComponents/studies/studies.model';

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
    { id: 'all', label: '// ALL_CREDENTIALS' },
    { id: 'academic', label: '// DEGREES_&_DIPLOMAS' },
    { id: 'specialization', label: '// BOOTCAMPS_&_SPECIALIZATIONS' },
    { id: 'certification', label: '// CERTIFICATIONS' }
  ];

  public setFilter(filterId: string): void {
    this.activeFilter = filterId;
  }

  public get filteredStudies(): StudyItem[] {
    if (this.activeFilter === 'all') return this.studiesList;
    return this.studiesList.filter(item => item.type === this.activeFilter);
  }
}