import {Component} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/common';

import {ContactInfo} from '../../models/contact-info';
import {ContactInfoService} from '../../services/contact-info';
import {BaseHttpService} from '../../services/base-http';
import * as constants from '../../config/constants';
import {NotificationService} from '../../services/notification';
import {BrowserDomAdapter} from 'angular2/platform/browser';



@Component({
	selector: 'contact-info',
	templateUrl: './components/contact-info/contact-info.html',
	styleUrls: ['./components/contact-info/contact-info.css'],
	providers: [ContactInfoService, BaseHttpService, NotificationService, BrowserDomAdapter],
	directives: [FORM_DIRECTIVES]
})

export class ContactInfoCmp {
	form: ControlGroup;

	id = new Control('');
	address = new Control('', Validators.required);
	infoType = new Control('', Validators.required);
	city = new Control('', Validators.required);
	state = new Control('', Validators.required);
	country = new Control('', Validators.required);
	email = new Control('', Validators.required);
	phone = new Control('', Validators.required);
	zip = new Control('', Validators.required);

	infoTypes = ['home', 'work', 'mobile'];

	contactInfo: ContactInfo = new ContactInfo();


	constructor(private contactInfoService: ContactInfoService, private router:Router, private params: RouteParams, private formBuilder: FormBuilder, private httpService: BaseHttpService, private notificationService: NotificationService) {

		var id: string = params.get('id');
		this.contactInfo.contactId = params.get('contactId');
		if (id) {
			let self = this;
			contactInfoService
				.get(id)
				.subscribe((contactInfo) => self.contactInfo = contactInfo);
		}

		this.form = this.formBuilder.group({
			address: this.address,
			infoType: this.infoType,
			city: this.city,
			state: this.state,
			country: this.country,
			email: this.email,
			phone: this.phone,
			zip: this.zip
		});
	};

	save() {
		var self = this;

		if (this.contactInfo.id) {
			this.httpService.http.patch(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_table/contact_info', this.contactInfo.toJson(true))
				.subscribe((data) => {
					this.notificationService.show('success', 'Contact Info Updated!');
				});
		} else {
			this.httpService.http.post(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_table/contact_info/', this.contactInfo.toJson(true))
				.subscribe((data) => {
					this.notificationService.show('success', 'New Contact Info Created!');
					self.back();
				});
		}

	};

	back () {
		this.router.navigate(['/Contact', { id: this.contactInfo.contactId }]);
	};
}
