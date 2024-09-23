import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cargo } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CargoService {
  private _urlEndpoint: string;

  constructor(private _http: HttpClient) {
    this._urlEndpoint = `${environment.API_URL}/cargos`;
  }

  getAllCargos(): Observable<Cargo[]> {
    return this._http.get<Cargo[]>(this._urlEndpoint);
  }
}
