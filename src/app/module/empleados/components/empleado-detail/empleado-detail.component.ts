import {
  Component,
  ElementRef,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Empleado } from '../../../../core/models';
import { Subscription } from 'rxjs';
import { EmpleadoService } from '../../services/empleado.service';
import { ModalDetalleEmpleadoService } from '../../../../core/services/modal-detalle-cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProfilePhotoPipe } from '../../pipes/profile-photo.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empleado-detail',
  standalone: true,
  imports: [CommonModule, ProfilePhotoPipe],
  templateUrl: './empleado-detail.component.html',
  styleUrl: './empleado-detail.component.css',
})
export class EmpleadoDetailComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('foto') input!: ElementRef;

  empleado?: Empleado;
  archivoSeleccionado: File | null = null;
  progreso: number = 0;
  private _operacion: string = '';

  private _empleadoService = inject(EmpleadoService);
  private _router = inject(Router);
  public modalDetalleEmpleadoService = inject(ModalDetalleEmpleadoService);

  private _subscriptions: Subscription = new Subscription();

  titulo: string = 'Detalle cliente';

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    this._loadCustomerData();
  }

  onSelectFile() {
    this.archivoSeleccionado = this.input.nativeElement.files[0];
    this.progreso = 0;
    if (this.archivoSeleccionado!.type.indexOf('image') < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Debe seleccionar una imágen válida`,
      });
      this._resetFileInput();
    }
  }

  uploadProfilePhoto() {
    if (!this.archivoSeleccionado) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Debe seleccionar una imágen válida`,
      });
      this._resetFileInput();
      return;
    }

    this._operacion = this.empleado?.foto ? 'update' : 'save';

    this._empleadoService
      .uploadProfilePhoto(
        this.archivoSeleccionado!,
        this.empleado!.empleadoId,
        this._operacion
      )
      .subscribe((event) => {
        /**
         * HttpEventType.UploadProgress: para mostrar el progreso de la carga del archivo
         * HttpEventType.Response: para verificar si ya terminó la carga del archivo
         */

        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progreso = event.total
              ? Math.round((100 * event.loaded) / event.total)
              : 100;
            break;

          case HttpEventType.Response:
            this.empleado = event.body!;
            Swal.fire({
              icon: 'success',
              title: 'Archivo cargado',
              text: `Foto cargada con éxito`,
            });
            this._router.navigateByUrl('/empleados');
            this._empleadoService.notifiyEmployeeList(this.empleado!);
            break;
        }

        this._resetFileInput();
      });
  }

  closeCustomerDetailModal(): void {
    this.modalDetalleEmpleadoService.closeModal();
    this.modalDetalleEmpleadoService.setCustomerModalData(null);
    this.progreso = 0;
    this._resetFileInput();
  }

  private _resetFileInput(): void {
    this.archivoSeleccionado = null;
    this.input.nativeElement.value = null;
  }

  private _loadCustomerData(): void {
    this.modalDetalleEmpleadoService.empleado$.subscribe(
      (data) => (this.empleado = data!)
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
