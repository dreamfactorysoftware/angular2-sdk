import {Injectable} from'angular2/core';
import {Http, Headers, URLSearchParams} from 'angular2/http';
import {Group} from '../models/group';
import {Contact} from '../models/contact';
import * as constants from '../config/constants';
import {BaseHttpService} from './base-http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {ContactService} from './contact';

class ServerResponse {
	constructor(public resource: any) {
	}
};

@Injectable()
export class GroupService {
	baseResourceUrl: string = constants.DSP_INSTANCE_URL + '/api/v2/db/_table/contact_group';
	contactGroupUrl: string = constants.DSP_INSTANCE_URL + '/api/v2/db/_table/contact_group_relationship';
	constructor(private httpService: BaseHttpService, private contactService: ContactService) {

	};


	query(): Observable<Group[]> {
		return this.httpService.http
			.get(this.baseResourceUrl)
			.map((response) => {
				var result: ServerResponse = response.json();
				let groups: Array<Group> = [];
				result.resource.forEach((group) => {
					groups.push(Group.fromJson(group));
				});
				return groups;
			});
	};

	get(id: string): Observable<Group> {
		return this.httpService.http
			.get(this.baseResourceUrl + '/' + id)
			.map((response) => {
				var result: ServerResponse = response.json();
				let group: Group = Group.fromJson(result);
				return group;
			});
	};

	save (group: Group): Observable<any> {
		if (group.id) {
			return this.httpService.http.put(this.baseResourceUrl + '/' + group.id, group.toJson(true))
				.map((response) => {
					return response;
				});
		} else {
			return this.httpService.http.post(this.baseResourceUrl, group.toJson(true))
				.map((response) => {
					return response;
				});
		}
	}
}