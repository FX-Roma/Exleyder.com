import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  public developerName: string = 'EXLEYDER GALLEGO';
  public isScrolled: boolean = false;

  public navLinks = [
  { label: 'About', path: '/overview' },
  { label: 'Projects', path: '/projects' },
  { label: 'Studies', path: '/studies' },
  { label: 'Skills', path: '/skills' },
  { label: 'Contact', path: '/contact' }
];

  /**
   * Listens to the browser window scroll event.
   * Activates the background state when scroll Y position exceeds 20px.
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 20;
  }
}