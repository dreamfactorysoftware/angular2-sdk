import { Injectable } from 'angular2/core';
import { URLSearchParams, Headers, RequestOptions } from 'angular2/http';
import { ContactGroup } from '../models/contact-group';
import * as constants from '../config/constants';
import { BaseHttpService } from './base-http';
import { ContactService } from './contact';
import { GroupService } from './group';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

class ServerResponse {
    constructor(public resource: any) {}
};

@Injectable()
export class ContactGroupService {
    baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_table/contact_group_relationship';
    constructor(private httpService: BaseHttpService, private contactService: ContactService, private groupService: GroupService) {

    };

    query(params: URLSearchParams, includeContacts = false, includeGroups = false): Observable < ContactGroup[] > {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        var self = this;
        return this.httpService.http
            .get(this.baseResourceUrl, { search: params, headers: queryHeaders })
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
                }).catch(this.handleError);
                return contactGroups;
            });
    };

    addGroup(groupId, contactId): Observable < any > {
        var data: Array < any > = [
            { contact_id: contactId, contact_group_id: groupId }
        ];
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http
            .post(this.baseResourceUrl, JSON.stringify(data), options)
            .map((response) => {
                var result: ServerResponse = response.json();
                return result.resource[0];
            }).catch(this.handleError);
    };

    remove(id: string): Observable < any > {
        var params = new URLSearchParams();
        params.set('filter', 'id=' + id);
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .delete(this.baseResourceUrl, { search: params, headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return parseInt(result.id);
            }).catch(this.handleError);
    };
    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg); // log to console instead
        localStorage.setItem('session_token', '');
        window.location.hash = '/login';
        return Observable.throw(errMsg);
    };
}
