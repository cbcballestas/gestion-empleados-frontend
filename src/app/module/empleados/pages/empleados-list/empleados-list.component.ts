import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { Empleado } from '../../../../core/models';
import { EmpleadoService } from '../../services/empleado.service';
import { ModalDetalleEmpleadoService } from '../../../../core/services/modal-detalle-cliente.service';

import Swal from 'sweetalert2';
import { EmpleadoDetailComponent } from '../../components/empleado-detail/empleado-detail.component';

@Component({
  selector: 'app-empleados-list',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, EmpleadoDetailComponent],
  templateUrl: './empleados-list.component.html',
  styleUrl: './empleados-list.component.css',
})
export class EmpleadosListComponent implements OnInit, OnDestroy {
  empleados: Empleado[] = [];

  private _empleadoService = inject(EmpleadoService);
  private _modalClienteService = inject(ModalDetalleEmpleadoService);

  private _subscriptions = new Subscription();

  ngOnInit(): void {
    this._empleadoService.empleados$.subscribe((response) => {
      this.empleados = this.empleados.map((empleadoOriginal) => {
        if (response.empleadoId == empleadoOriginal.empleadoId) {
          empleadoOriginal.foto = response.foto;
        }

        return empleadoOriginal;
      });
    });

    this._empleadoService
      .getEmployees()
      .subscribe((data) => (this.empleados = data));
  }

  deleteCustomerById(empleado: Empleado, indice: number) {
    Swal.fire({
      title: 'Esta seguro?',
      text: `Seguro que desea eliminar al empleado?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._subscriptions.add(
          this._empleadoService
            .deleteEmployeeById(empleado.empleadoId)
            .subscribe(() => {
              this.empleados.splice(indice, 1);
              Swal.fire(
                'Cliente borrado!',
                `Empleado borrado con éxito.`,
                'success'
              );
            })
        );
      }
    });
  }

  openCustomerDetailModal(empleado: Empleado) {
    this._modalClienteService.openModal();
    this._modalClienteService.setCustomerModalData(empleado);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
