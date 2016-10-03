import {Component, Inject} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/common';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {BaseHttpService} from '../../services/base-http';
import * as constants from '../../config/constants';


import {NotificationService} from '../../services/notification';
import {BrowserDomAdapter} from 'angular2/platform/browser';



@Component({
  selector: 'df-login',
  templateUrl: './components/login/login.html',
  styleUrls: ['./components/login/login.css'],
  directives: [FORM_DIRECTIVES, ROUTER_DIRECTIVES],
  providers: [BaseHttpService, NotificationService, BrowserDomAdapter]
})

export class LoginCmp {

	form: ControlGroup;
	email: Control = new Control('', Validators.required);
	password: Control = new Control('', Validators.required);

	constructor (formBuilder: FormBuilder, private httpService: BaseHttpService, private _router: Router, private notificationService: NotificationService) {
		this.form = formBuilder.group({
			email: this.email,
			password: this.password
		});
	}

	private storeToken (data) {
		this.httpService.http._defaultOptions.headers.set('X-Dreamfactory-Session-Token', data && data.session_token);
		localStorage.setItem('session_token', data.session_token);
		this._router.navigate(['ContactList']);
	}

	formSubmit () {
		this.httpService.http.post(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/user/session', JSON.stringify(this.form.value))
			.subscribe((data) => {
				this.storeToken(data.json());
			}, (error) => {
				this.notificationService.show('error', 'Cannot login, try again!');
			});
	}
}
