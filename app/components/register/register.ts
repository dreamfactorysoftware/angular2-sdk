import { Component } from 'angular2/core';
import { FormBuilder, Validators, Control, ControlGroup } from 'angular2/common';
import { Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { Headers, RequestOptions } from 'angular2/http';
import { BaseHttpService } from '../../services/base-http';
import * as constants from '../../config/constants';
import { NotificationService } from '../../services/notification';
import { ValidationService } from '../../services/validation';
import { BrowserDomAdapter } from 'angular2/platform/browser';

@Component({
    selector: 'df-register',
    templateUrl: './components/register/register.html',
    styleUrls: ['./components/register/register.css'],
    providers: [BaseHttpService, NotificationService, BrowserDomAdapter],
    directives: [ROUTER_DIRECTIVES]
})

export class RegisterCmp {
    form: ControlGroup;

    constructor(private httpService: BaseHttpService, private formBuilder: FormBuilder, private router: Router,
        private notificationService: NotificationService) {
        this.form = formBuilder.group({
            first_name: new Control('', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.required])),
            last_name: new Control(''),
            email: new Control('', Validators.compose([Validators.maxLength(50), ValidationService.emailValidator, Validators.required])),
            password: new Control('', Validators.compose([Validators.minLength(6), Validators.maxLength(50), Validators.required]))
        });
    }

    private storeToken(data) {
        localStorage.setItem('session_token', data.session_token);
        this.router.navigate(['GroupList']);
    }

    register() {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: queryHeaders });
        this.httpService.http
            .post(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/user/register?login=true', JSON.stringify(this.form.value), options)
            .subscribe((response) => {
                this.storeToken(response.json());
            }, (error) => {
                this.notificationService.show('error', JSON.parse(error._body).error.message);
            });
    }
}
