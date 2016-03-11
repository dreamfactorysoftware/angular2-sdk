import {Component, OnInit, Pipe, PipeTransform} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {URLSearchParams} from 'angular2/http';
import {Contact} from '../../models/contact';
import {ContactService} from '../../services/contact';
import {BaseHttpService} from '../../services/base-http';



@Component({
  selector: 'contact-list',
  templateUrl: './components/contact-list/contact-list.html',
  styleUrls: ['./components/contact-list/contact-list.css'],
  providers: [ContactService, BaseHttpService],
  directives: [ROUTER_DIRECTIVES]
})


export class ContactListCmp {
	public contacts: Contact[] = [];
	shadowImage: string = 'https://image.freepik.com/free-icon/male-user-shadow_318-34042.png';

	constructor (private contactService: ContactService, private router: Router) {
		this.getList();
	}

	getList () {
		let self = this;
		let params: URLSearchParams = new URLSearchParams();
		params.set('order', 'last_name+ASC');

		this.contactService.query(params)
			.subscribe((contacts: Contact[]) => {
				self.contacts = contacts
			});
	}

	show (contactId) {
		this.router.navigate(['/Contact', { id: contactId }]);
	}

	remove (contactId) {
		var self = this;
		this.contactService.remove(contactId)
			.subscribe(() => {
				self.contacts = self.contacts.filter((item) => {
					return item.id != contactId
				});
			});
	}
}

