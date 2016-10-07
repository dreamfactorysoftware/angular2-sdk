import { Component } from 'angular2/core';
import { FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup } from 'angular2/common';
import { Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { Headers, RequestOptions } from 'angular2/http';
import { ValidationService } from '../../services/validation';
import { BaseHttpService } from '../../services/base-http';
import * as constants from '../../config/constants';
import { NotificationService } from '../../services/notification';
import { BrowserDomAdapter } from 'angular2/platform/browser';

@Component({
    selector: 'df-login',
    templateUrl: './components/login/login.html',
    styleUrls: ['./components/login/login.css'],
    directives: [FORM_DIRECTIVES, ROUTER_DIRECTIVES],
    providers: [BaseHttpService, NotificationService, BrowserDomAdapter]
})

export class LoginCmp {

    form: ControlGroup;
    email: Control = new Control('', Validators.compose([Validators.maxLength(50), ValidationService.emailValidator, Validators.required]));
    password: Control = new Control('', Validators.compose([Validators.minLength(6), Validators.maxLength(50), Validators.required]));


    constructor(formBuilder: FormBuilder, private httpService: BaseHttpService, private _router: Router,
        private notificationService: NotificationService) {
        this.form = formBuilder.group({
            email: this.email,
            password: this.password
        });
    }

    private storeToken(data) {
        localStorage.setItem('session_token', data.session_token);
        this._router.navigate(['GroupList']);
    }

    formSubmit() {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: queryHeaders });
        this.httpService.http.post(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/user/session', JSON.stringify(this.form.value), options)
            .subscribe((data) => {
                this.storeToken(data.json());
            }, (error) => {
                this.notificationService.show('error', JSON.parse(error._body).error.message);
            });
    }
}
