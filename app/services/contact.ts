import {Injectable} from'angular2/core';
import {Http, Headers, URLSearchParams} from 'angular2/http';
import {Contact} from '../models/contact';
import * as constants from '../config/constants';
import {BaseHttpService} from './base-http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

class ServerResponse {
	constructor (public resource: any) {
	}
};

@Injectable()
export class ContactService {
	baseResourceUrl: string = constants.DSP_INSTANCE_URL + '/api/v2/db/_table/contact'; 
	constructor(private httpService: BaseHttpService) {

	};


	query (params?:URLSearchParams): Observable<Contact[]> {
		return this.httpService.http
			.get(this.baseResourceUrl, { search: params })
			.map((response) => {
				var result: any = response.json();
				let contacts: Array<Contact> = [];
				result.resource.forEach((contact) => {
					contacts.push(Contact.fromJson(contact));	
				});
				return contacts;
			});
	};

	get (id: string, params?: URLSearchParams): Observable<Contact> {
		return this.httpService.http
			.get(this.baseResourceUrl + '/' + id, { search: params })
			.map((response) => {
				var result: any = response.json();
				let contact: Contact = Contact.fromJson(result);
				return contact;
			});
	};

	remove (id: string) {
		return this.httpService.http
			.delete(this.baseResourceUrl + '/' + id)
			.map((response) => {
				var result: any = response.json();
				return result.id;
			});	
	}
}