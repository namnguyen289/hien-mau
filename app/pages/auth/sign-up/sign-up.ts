import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl} from '@angular/common';
import {CustomValidators} from '../../../providers/custom-validators/custom-validators';
import {UserData} from '../../../providers/user-data';
import {AccountPage} from '../account/account';

@Component({
  templateUrl: 'build/pages/auth/sign-up/sign-up.html',
  directives: [FORM_DIRECTIVES]
})
export class SignUpPage {
  authForm: ControlGroup;
  email: AbstractControl;
  password: AbstractControl;
  error:any;
  constructor(private nav: NavController, private fb: FormBuilder, private userData: UserData) {
    this.authForm = fb.group({
      'email': ['', Validators.compose([Validators.required, CustomValidators.checkEmailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.email = this.authForm.controls['email'];
    this.password = this.authForm.controls['password'];
  }

  onSubmit(value: any): void {
    this.error = null;
    if (this.authForm.valid) {
      console.log('Submitted value: ', value);
      this.userData.registerUser(value).then(user => {
        console.log(`Create User Success:`, user);
        this.userData.onLogin(user);
        this.nav.setRoot(AccountPage,this.userData.authData);
      }).catch(e => {
        this.error = e;
        console.error(`Create User Failure:`, e);
      });
    }
  }

}
