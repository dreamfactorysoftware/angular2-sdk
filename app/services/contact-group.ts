import {Injectable} from'angular2/core';
import {Http, Headers, URLSearchParams} from 'angular2/http';
import {ContactGroup} from '../models/contact-group';
import * as constants from '../config/constants';
import {BaseHttpService} from './base-http';
import {ContactService} from './contact';
import {GroupService} from './group';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

class ServerResponse {
	constructor (public resource: any) {
	}
};

@Injectable()
export class ContactGroupService {
	baseResourceUrl: string = constants.DSP_INSTANCE_URL + '/api/v2/db/_table/contact_group_relationship'; 
	constructor(private httpService: BaseHttpService, private contactService: ContactService, private groupService: GroupService) {

	};

	query (params: URLSearchParams, includeContacts = false, includeGroups = false): Observable<ContactGroup[]> {
		var self = this;
		return this.httpService.http
			.get(this.baseResourceUrl, { search: params })
			.map((response) => {
				var result: ServerResponse = response.json();
				return result.resource.map((item) => {
					return ContactGroup.fromJson(item);
				});
			})
			.map((contactGroups) => {
				var params = new URLSearchParams();
				params.set('fields', 'first_name, last_name');

				contactGroups.map((contactGroup) => {

					if (includeContacts) {
						self.contactService.get(contactGroup.contact.id, params)
							.subscribe((contact) => {
								contact.id = contactGroup.contact.id;
								contactGroup.contact = contact;
							});	
					} 

					if (includeGroups) {
						self.groupService.get(contactGroup.group.id)
							.subscribe((group) => {
								group.id = contactGroup.group.id;
								contactGroup.group = group;
							});		
					}
					
				});
				return contactGroups;
			});
	};

	addGroup(groupId, contactId): Observable<any> {
		var data: Array<any> = [
			{ contact_id: contactId, contact_group_id: groupId }
		];

		return this.httpService.http
			.post(this.baseResourceUrl, JSON.stringify(data))
			.map((response) => {
				var result: ServerResponse = response.json();
				return result.resource[0];
			});
	};

	remove (id: string): Observable<any> {
		var params = new URLSearchParams();
		params.set('filter', 'id=' + id);

		return this.httpService.http
			.delete(this.baseResourceUrl, { search: params })
			.map((response) => {
				var result: any = response.json();
				return parseInt(result.id);
			});
	};
}