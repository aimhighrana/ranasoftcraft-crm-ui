import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeSelectorService {

  constructor() { }

  public theme: BehaviorSubject<string> = new BehaviorSubject<string>('default-theme');
}
