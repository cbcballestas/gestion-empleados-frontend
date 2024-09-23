import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Pipe({
  name: 'profilePhoto',
  standalone: true,
})
export class ProfilePhotoPipe implements PipeTransform {
  transform(value?: string): string {
    return value != null ? `${value}` : `/no-usuario.png`;
  }
}
