import { Routes } from '@angular/router';
import { EmpleadosListComponent } from './module/empleados/pages/empleados-list/empleados-list.component';
import { EmpleadosFormComponent } from './module/empleados/pages/empleados-form/empleados-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'empleados',
    pathMatch: 'full',
  },
  {
    path: 'empleados',
    children: [
      {
        path: '',
        component: EmpleadosListComponent,
      },
      {
        path: 'nuevo',
        component: EmpleadosFormComponent,
        title: 'AngularApp - Nuevo Empleado',
      },
      {
        path: 'editar/:id',
        component: EmpleadosFormComponent,
        title: 'AngularApp - Editar Empleado',
      },
    ],
  },
];
