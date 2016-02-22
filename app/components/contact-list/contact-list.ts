import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

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

export class ContactListCmp implements OnInit {
	public contacts: Contact[] = [];
	shadowImage: string = 'https://image.freepik.com/free-icon/male-user-shadow_318-34042.png';

	constructor (private contactService: ContactService, private router: Router) {
		this.getList();
	}

	ngOnInit () {
		console.log('Init called for contacts')
	}

	getList () {
		let self = this;
		let params: any = {};
		this.contactService.query(params)
			.subscribe((contacts: Contact[]) => {
				self.contacts = contacts
			});
	}

	show (contactId) {
		this.router.navigate(['/Contact', { id: contactId }]);
	}
}
