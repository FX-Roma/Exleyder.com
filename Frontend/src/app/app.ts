import { Component } from '@angular/core';
import { AudioService } from './core/services/audio';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Preloader } from './components/preloader/preloader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, Footer, Preloader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'portfolio-engineer';

  constructor(audioService: AudioService) {
    // Force the root-provided service to initialize in the browser. Its own
    // platform guard keeps SSR safe.
    audioService.initialize();
  }
}