// src/app/components/skills/skills.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillCategory, SKILLS_DATA } from '../../pageObjects/skills.model';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class SkillsComponent {
  public skillCategories: SkillCategory[] = SKILLS_DATA;
  public hoveredCategory: string | null = null;

  public setHoveredCategory(id: string | null): void {
    this.hoveredCategory = id;
  }
}