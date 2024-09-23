import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Empleado } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ModalDetalleEmpleadoService {
  private clienteObservable: Subject<Empleado | null> = new Subject();

  empleado$ = this.clienteObservable.asObservable();
  isModalOpened: boolean = false;

  constructor() {}

  setCustomerModalData(empleado: Empleado | null) {
    this.clienteObservable.next(empleado);
  }

  openModal(): void {
    this.isModalOpened = true;
  }
  closeModal(): void {
    this.isModalOpened = false;
  }
}
