import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/common';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {BaseHttpService} from '../../services/base-http';
import * as constants from '../../config/constants';
import {NotificationService} from '../../services/notification';
import {BrowserDomAdapter} from 'angular2/platform/browser';

@Component({
  selector: 'df-register',
  templateUrl: './components/register/register.html',
  styleUrls: ['./components/register/register.css'],
  providers: [BaseHttpService, NotificationService, BrowserDomAdapter],
  directives: [ROUTER_DIRECTIVES]
})

export class RegisterCmp {
	form: ControlGroup;

	constructor(private httpService: BaseHttpService, private formBuilder: FormBuilder, private router: Router, private notificationService: NotificationService) {
		this.form = formBuilder.group({
			first_name: new Control('', Validators.required),
			last_name: new Control(''),
			email: new Control('', Validators.required),
			password: new Control('', Validators.required)
		});
	}

	private storeToken(data) {
		this.httpService.http._defaultOptions.headers.set('X-Dreamfactory-Session-Token', data && data.session_token);
		localStorage.setItem('session_token', data.session_token);
		this.router.navigate(['ContactList']);
	}

	register () {
		this.httpService.http
			.post(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/user/register?login=true', JSON.stringify(this.form.value))
			.subscribe((response) => {
				this.storeToken(response.json());
			}, (error) => {
				this.notificationService.show('error', 'Cannot register new user, try again!');
			});
	}
}
