import { Cargo } from './cargo.model';

export class Empleado {
  constructor(
    public empleadoId: number,
    public cedula: string,
    public nombre: string,
    public fechaIngreso: Date,
    public cargo: Cargo | null,
    public foto?: string
  ) {}
}
