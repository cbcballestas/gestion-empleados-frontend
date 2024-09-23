import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormErrorService } from '../../../core/services/form-error.service';

@Component({
  selector: 'app-form-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-errors.component.html',
  styleUrl: './form-errors.component.css',
})
export class FormErrorsComponent {
  isAlertEnabled: boolean = false;
  errores!: string[];

  private _formErrorService = inject(FormErrorService);

  ngOnInit(): void {
    this._formErrorService.errores$.subscribe((data) => {
      if (data.length > 0) {
        this.isAlertEnabled = true;
        this.errores = data;
      }
    });
  }
}
