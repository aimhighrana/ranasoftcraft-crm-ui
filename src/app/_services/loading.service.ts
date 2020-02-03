import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading: EventEmitter<boolean> = new EventEmitter(true);

  constructor() {
    this.isLoading.emit(false);
  }
}
