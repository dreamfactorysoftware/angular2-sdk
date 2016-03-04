import {Component} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/common';
import {URLSearchParams} from 'angular2/http';

import {Contact} from '../../models/contact';
import {ContactGroup} from '../../models/contact-group';
import {Group} from '../../models/group';
import {ContactService} from '../../services/contact';
import {ContactGroupService} from '../../services/contact-group';
import {GroupService} from '../../services/group';
import {BaseHttpService} from '../../services/base-http';
import * as constants from '../../config/constants';
import {ContactInfoListCmp} from '../contact-info/contact-info-list';



@Component({
  selector: 'contact',
  templateUrl: './components/contact/contact.html',
  styleUrls: ['./components/contact/contact.css'],
  providers: [ContactService, BaseHttpService, ContactGroupService, GroupService],
  directives: [FORM_DIRECTIVES, ContactInfoListCmp]
})

export class ContactCmp {
	form: ControlGroup;

	id = new Control('');
	firstName = new Control('', Validators.required);
	lastName = new Control('', Validators.required);
	imageUrl = new Control('');
	skype = new Control('');
	twitter = new Control('');

	selectedGroupId: string = null;

	contact: Contact = new Contact();
	contactGroups: Array<ContactGroup> = [];
	remainingGroups: Array<Group> = [];

	constructor (private contactService: ContactService, private groupService: GroupService, private contactGroupService: ContactGroupService, private router:Router, private params: RouteParams, private formBuilder: FormBuilder, private httpService: BaseHttpService) {
		
		var contactId: string = params.get('id');

		if (contactId) {
			let self = this;
			var contactGroupParams = new URLSearchParams();
			contactGroupParams.set('filter', 'contact_id=' + contactId);

			contactService
				.get(contactId)
				.subscribe((contact) => self.contact = contact);

			contactGroupService
				.query(contactGroupParams, false, true)
				.subscribe((contactGroups) => {
					self.contactGroups = contactGroups;
					self.getRemainingGroups();
				});

		}

		this.form = this.formBuilder.group({
			firstName: this.firstName,
			lastName: this.lastName,
			imageUrl: this.imageUrl,
			skype: this.skype,
			twitter: this.twitter
		});
	}

	getRemainingGroups () {
		var self = this;
		this.groupService
			.query()
			.subscribe((groups) => {
				self.remainingGroups = groups.filter((item) => {
					return !self.contactGroups.some((a) => {
						return a.group.id == item.id;
					});
				});
			})
	}

	back () {
		this.router.navigate(['/ContactList']);
	};

	addSelectedGroup() {
		if (!this.selectedGroupId) return;

		var self = this;
		var group = this.remainingGroups.filter((item) => {
			return item.id == self.selectedGroupId;
		})[0];

		this.contactGroupService.addGroup(group.id, this.contact.id)
			.subscribe((response) => {
				var newContactGroup = new ContactGroup(response.id);
				newContactGroup.group = group;

				self.remainingGroups = self.remainingGroups.filter((item) => {
					return item.id !== group.id;
				});

				self.contactGroups.push(newContactGroup);
				self.selectedGroupId = null;
			});
	};

	removeGroup (contactGroup: ContactGroup) {
		var self = this;
		this.contactGroupService
			.remove(contactGroup.id)
			.subscribe((item) => {
				self.contactGroups = self.contactGroups.filter((item) => {
					return item.id !== contactGroup.id;
				});

				self.remainingGroups.push(contactGroup.group);
			});
	}

	save () {
		var self = this;
		var isNew = !!this.contact.id;

		this.contactService.save(this.contact)
			.subscribe((response) => {
				if (isNew)
						alert('New contact created');
				else
						alert('Contact updated');
						
				self.back();
			})
		
	}
}
