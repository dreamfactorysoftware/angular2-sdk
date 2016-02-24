import {Injectable} from'angular2/core';
import {Http, Headers, URLSearchParams} from 'angular2/http';
import {ContactInfo} from '../models/contact-info';
import * as constants from '../config/constants';
import {BaseHttpService} from './base-http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

class ServerResponse {
	constructor (public resource: any) {
	}
};

@Injectable()
export class ContactInfoService {
	baseResourceUrl: string = constants.DSP_INSTANCE_URL + '/api/v2/db/_table/contact_info'; 
	constructor(private httpService: BaseHttpService) {

	};


	query(params: URLSearchParams): Observable<ContactInfo[]> {

		return this.httpService.http
			.get(this.baseResourceUrl, { search: params })
			.map((response) => {
				var result: ServerResponse = response.json();
				let contacts: Array<ContactInfo> = [];
				result.resource.forEach((contact) => {
					contacts.push(ContactInfo.fromJson(contact));	
				});
				return contacts;
			});
	};

	get (id: string): Observable<ContactInfo> {
		return this.httpService.http
			.get(this.baseResourceUrl + '/' + id)
			.map((response) => {
				var result: ServerResponse = response.json();
				let contactInfo: ContactInfo = ContactInfo.fromJson(result);
				return contactInfo;
			});
	};

	remove (id: number): Observable<any> {
		return this.httpService.http
			.delete(this.baseResourceUrl + '/' + id)
			.map((response) => {
				var result: any = response.json();
				return parseInt(result.id);
			});
	};
}