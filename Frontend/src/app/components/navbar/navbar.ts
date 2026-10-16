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
export class NavbarComponent {
  public developerName: string = 'EXLEYDER GALLEGO';
  public isScrolled: boolean = false;

  public navLinks = [
  { label: 'Home', path: '/home' },
  { label: 'Experience', path: '/projects' },
  { label: 'Studies', path: '/studies' },
  { label: 'Skills', path: '/skills' },
  { label: 'Contact', path: '/contact' }
];


  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 20;
  }
}