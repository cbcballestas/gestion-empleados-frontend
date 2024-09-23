import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subscription, switchMap } from 'rxjs';
import { Cargo, Empleado } from '../../../../core/models';
import { EmpleadoService } from '../../services/empleado.service';
import { CargoService } from '../../../../core/services/cargo.service';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { format, parse } from 'date-fns';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormErrorsComponent } from '../../../../shared/components/form-errors/form-errors.component';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-empleados-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormErrorsComponent,
    MatDatepickerModule,
    MatFormFieldModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './empleados-form.component.html',
  styleUrl: './empleados-form.component.css',
})
export class EmpleadosFormComponent implements OnInit, OnDestroy {
  titulo: string = 'Nuevo Empleado';
  edicion: boolean = false;
  id: number = 0;
  maxFecha: Date = new Date();

  private _empleadoService = inject(EmpleadoService);
  private _cargoService = inject(CargoService);
  private _fb = inject(FormBuilder);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  cargos$!: Observable<Cargo[]>;

  private _subscriptions$ = new Subscription();

  form = this._fb.nonNullable.group({
    empleadoId: [0],
    cedula: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    fechaIngreso: [new Date(), [Validators.required]],
    cargo: new FormControl<Cargo | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    this._subscriptions$.add(
      this._route.params.subscribe(({ id }) => {
        if (id) {
          this.titulo = 'Editar Empleado';
          this.edicion = true;
          this.id = id;

          //Se realiza la búsqueda del empleado por el ID suministrado

          this._empleadoService
            .getEmployeeById(id)
            .subscribe((empleado) => this._loadFormValues(empleado));
        }
      })
    );
    this.cargos$ = this._cargoService.getAllCargos();
  }

  compararRegion(o1: Cargo, o2: Cargo): boolean {
    if (o1 === null && o2 === null) {
      return true;
    }

    return o1 === null || o2 === null ? false : o1.idCargo === o2.idCargo;
  }

  procesar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.form.value['fechaIngreso'] = parse(
      this._dateToString(this.form.value['fechaIngreso']!),
      'yyyy-MM-dd',
      new Date()
    );

    console.log(this.form.getRawValue());

    if (this.edicion) {
      this._subscriptions$.add(
        this._empleadoService
          .updateEmployeeData(this.id, this.form.getRawValue())
          .pipe(
            switchMap((data) => {
              this._router.navigateByUrl('/empleados');
              Swal.fire({
                icon: 'success',
                title: 'Editar Cliente',
                text: `Cliente ${data.nombre} actualizado con éxito`,
              });
              return EMPTY;
            })
          )
          .subscribe()
      );
    } else {
      this._subscriptions$.add(
        this._empleadoService
          .saveEmployeeData(this.form.getRawValue())
          .pipe(
            switchMap((data) => {
              this._router.navigateByUrl('/empleados');
              Swal.fire({
                icon: 'success',
                title: 'Nuevo Empleado',
                text: `Empleado ${data.nombre} creado con éxito`,
              });
              return EMPTY;
            })
          )
          .subscribe()
      );
    }
  }

  asignarFecha(event: MatDatepickerInputEvent<Date>) {
    this.form.value['fechaIngreso'] = new Date(event.value!);
  }

  private _loadFormValues(empleado: Empleado): void {
    this.form.patchValue({
      empleadoId: empleado.empleadoId,
      nombre: empleado.nombre,
      cedula: empleado.cedula,
      fechaIngreso: new Date(empleado.fechaIngreso),
      cargo: empleado.cargo,
    });
  }

  private _dateToString(fecha: Date) {
    return format(new Date(fecha), 'yyyy-MM-dd');
  }

  get nombre() {
    return this.form.controls.nombre;
  }
  get cedula() {
    return this.form.controls.cedula;
  }
  get fechaIngreso() {
    return this.form.controls.fechaIngreso;
  }

  get cargo() {
    return this.form.controls.cargo;
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
}
