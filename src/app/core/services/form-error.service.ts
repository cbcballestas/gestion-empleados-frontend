import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormErrorService {
  private errorObservable = new BehaviorSubject<string[]>([]);
  errores$ = this.errorObservable.asObservable();

  constructor() {}

  setErrors(errores: string[]) {
    this.errorObservable.next(errores);
  }
}
