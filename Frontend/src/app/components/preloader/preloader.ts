// src/app/components/preloader/preloader.ts
import { Component, OnInit, Output, EventEmitter, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preloader.html',
  styleUrl: './preloader.css'
})
export class Preloader implements OnInit {
  public progress: number = 0;
  public currentLogIndex: number = 0;
  public isFadingOut: boolean = false;
  public isHidden: boolean = false;

  @Output() complete = new EventEmitter<void>();

  public bootLogs: string[] = [
    '[01/04] INITIALIZING KEFEX SYSTEM CORE v2.4...',
    '[02/04] LOADING MEAN/MERN ARCHITECTURE & REST APIs...',
    '[03/04] VERIFYING C1 ADVANCED BILINGUAL TELEMETRY...',
    '[04/04] OVER OREJUELA PORTFOLIO // READY'
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Solo inicia el temporizador en el cliente/navegador
    if (isPlatformBrowser(this.platformId)) {
      this.runBootSequence();
    } else {
      this.isHidden = true;
    }
  }

  private runBootSequence(): void {
    const interval = setInterval(() => {
      this.progress += Math.floor(Math.random() * 8) + 4;

      if (this.progress >= 25 && this.currentLogIndex === 0) this.currentLogIndex = 1;
      if (this.progress >= 55 && this.currentLogIndex === 1) this.currentLogIndex = 2;
      if (this.progress >= 85 && this.currentLogIndex === 2) this.currentLogIndex = 3;

      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          this.isFadingOut = true;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.isHidden = true;
            this.complete.emit();
            this.cdr.detectChanges();
          }, 800);
        }, 500);
      }

      // Forzar actualización visual en vivo
      this.cdr.detectChanges();
    }, 45);
  }
}