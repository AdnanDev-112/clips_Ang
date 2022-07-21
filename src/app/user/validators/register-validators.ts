import { ValidationErrors, AbstractControl } from '@angular/forms';
export class RegisterValidators {
  static match(group: AbstractControl): ValidationErrors | null {
    const control = group.get('password');
    const matchingControl = group.get('confirm_passsword');
    if (!control || !matchingControl) {
      return { controlNotFound: false };
    }

    const error =
      control.value === matchingControl.value ? null : { noMatch: true };

    return error;
  }
}
