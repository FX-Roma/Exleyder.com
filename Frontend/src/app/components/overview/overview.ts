// src/app/components/overview/overview.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class OverviewComponent {
  public developerRoleTag: string = 'FULL-STACK / AI / DIGITAL / AVAILABLE FOR OPPORTUNITIES';
  public developerBio: string = 'Full-Stack Developer with a passion for modern web technologies, AI and digital solutions. I turn ideas into functional products, combining technical skills, problem-solving and clear communication to create real value for users and clients.';
  
  // Custom Cursor Badge States
  public isSloganHovered: boolean = false;
  public cursorX: number = 0;
  public cursorY: number = 0;

  public systemMetrics = [
    { label: 'Frontend', status: 'Online', tech: 'Angular / React / TS' },
    { label: 'Backend', status: 'Online', tech: 'Node.js / Express' },
    { label: 'Database', status: 'Online', tech: 'MongoDB / PostgreSQL' },
    { label: 'AI Services', status: 'Active', tech: 'LangChain / Copilot' }
  ];

  public onSloganMouseMove(event: MouseEvent): void {
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
  }

  public onSloganMouseEnter(): void {
    this.isSloganHovered = true;
  }

  public onSloganMouseLeave(): void {
    this.isSloganHovered = false;
  }
}