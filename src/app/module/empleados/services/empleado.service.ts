import { FormErrorService } from './../../../core/services/form-error.service';
import {
  HttpClient,
  HttpEvent,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, Subject } from 'rxjs';
import { Empleado } from '../../../core/models';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '../../../core/interfaces';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private _empleadoObservable: Subject<Empleado> = new Subject();

  private _http = inject(HttpClient);
  private _router = inject(Router);
  private _formErrorService = inject(FormErrorService);

  empleados$ = this._empleadoObservable.asObservable();

  getEmployees(): Observable<Empleado[]> {
    return this._http.get<Empleado[]>(`${environment.API_URL}/empleados`);
  }
  getEmployeeById(id: number): Observable<Empleado> {
    return this._http
      .get<Empleado>(`${environment.API_URL}/empleados/${id}`)
      .pipe(
        catchError(({ error }: HttpErrorResponse) => {
          this._router.navigateByUrl('/empleados');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${error.message}`,
          });
          return EMPTY;
        })
      );
  }
  saveEmployeeData(cliente: Empleado): Observable<Empleado> {
    return this._http
      .post<Empleado>(`${environment.API_URL}/empleados`, cliente)
      .pipe(
        catchError(({ error }: HttpErrorResponse) => {
          if (error.errors) {
            this._formErrorService.setErrors(error.errors);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al crear cliente',
              text: `${error.message}`,
            });
          }
          return EMPTY;
        })
      );
  }
  updateEmployeeData(id: number, empleado: Empleado): Observable<Empleado> {
    return this._http
      .put<Empleado>(`${environment.API_URL}/empleados/${id}`, empleado)
      .pipe(
        catchError(({ error }: HttpErrorResponse) => {
          if (error.errors) {
            this._formErrorService.setErrors(error.errors);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar cliente',
              text: `${error.message}`,
            });
          }
          return EMPTY;
        })
      );
  }
  deleteEmployeeById(id: number): Observable<void> {
    return this._http
      .delete<void>(`${environment.API_URL}/empleados/${id}`)
      .pipe(
        catchError(({ error }: HttpErrorResponse) => {
          this._router.navigateByUrl('/empleados');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${error.message}`,
          });
          console.error(error.message);
          return EMPTY;
        })
      );
  }

  uploadProfilePhoto(
    archivo: File,
    id: number,
    operacion: string
  ): Observable<HttpEvent<Empleado>> {
    // Se asignan los valores requeridos por el API
    let formData: FormData = new FormData();
    formData.append('file', archivo);

    const params = new HttpParams().set('operation', operacion);

    const req = new HttpRequest(
      'POST',
      `${environment.API_URL}/upload/${id}`,
      formData,
      {
        reportProgress: true,
        params: params,
      }
    );

    return this._http.request<Empleado>(req);
  }

  notifiyEmployeeList(empleado: Empleado): void {
    this._empleadoObservable.next(empleado);
  }
}
