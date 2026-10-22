// src/app/core/services/audio.spec.ts

import { TestBed } from '@angular/core/testing';
import { AudioService } from './audio';

describe('AudioService', () => {
  let service: AudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioService]
    });
    service = TestBed.inject(AudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle play call without throwing errors', () => {
    expect(() => service.play('navbarClick')).not.toThrow();
  });

  it('should handle stop call gracefully', () => {
    expect(() => service.stop('loaderBackground')).not.toThrow();
  });
});