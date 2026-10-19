import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillCategory, SKILLS_DATA } from '../../models/skills.model';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class SkillsComponent {
  public skillCategories = signal<SkillCategory[]>(SKILLS_DATA);
  public activeCategory = signal<string | null>(null);

  /**
   * ANIMACIÓN 3D INTERACTIVA:
   * Calcula el ángulo de inclinación 3D (rotateX, rotateY) y la posición del brillo
   * especular (--mouse-x, --mouse-y) según la posición del cursor en la tarjeta.
   */
  public onCardMouseMove(event: MouseEvent, cardElement: HTMLElement): void {
    const rect = cardElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Máxima rotación en grados
    const maxRotate = 10;
    const rotateX = ((y - centerY) / centerY) * -maxRotate;
    const rotateY = ((x - centerX) / centerX) * maxRotate;

    cardElement.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
    cardElement.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
    cardElement.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    cardElement.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  }

  public onCardMouseLeave(cardElement: HTMLElement): void {
    cardElement.style.setProperty('--rx', '0deg');
    cardElement.style.setProperty('--ry', '0deg');
    cardElement.style.setProperty('--mouse-x', '50%');
    cardElement.style.setProperty('--mouse-y', '50%');
  }

  public setActiveCategory(id: string | null): void {
    this.activeCategory.set(id);
  }
}