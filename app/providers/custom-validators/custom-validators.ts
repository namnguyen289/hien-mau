import { Control, ControlGroup } from "@angular/common";

interface ValidationResult {
  [key: string]: boolean;
}

export class CustomValidators {

  public static checkFirstCharacterValidator(control: Control): ValidationResult {
    var valid = /^\d/.test(control.value);
    if (valid) {
      return { checkFirstCharacterValidator: true };
    }
    return null;
  }
  public static checkEmailValidator(control: Control): ValidationResult {
    var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regexEmail.test(control.value)) {
      return { checkEmailValidator: true };
    }
    return null;
  }
}