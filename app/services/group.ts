import { Injectable } from 'angular2/core';
import { URLSearchParams, Headers, RequestOptions } from 'angular2/http';
import { Group } from '../models/group';
import * as constants from '../config/constants';
import { BaseHttpService } from './base-http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import { ContactService } from './contact';

class ServerResponse {
    constructor(public resource: any) {}
};

@Injectable()
export class GroupService {
    baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_table/contact_group';
    contactGroupUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_table/contact_group_relationship';
    constructor(private httpService: BaseHttpService, private contactService: ContactService) {

    };


    query(params ? : URLSearchParams): Observable < Group[] > {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .get(this.baseResourceUrl, { search: params })
            .map((response) => {
                var result: ServerResponse = response.json();
                let groups: Array < Group > = [];
                result.resource.forEach((group) => {
                    groups.push(Group.fromJson(group));
                });
                return groups;
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
    get(id: string): Observable < Group > {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .get(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
            .map((response) => {
                var result: ServerResponse = response.json();
                let group: Group = Group.fromJson(result);
                return group;
            }).catch(this.handleError);
    };

    remove(id: string) {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .delete(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return result.id;
            }).catch(this.handleError);
    }

    save(group: Group): Observable < any > {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        if (group.id) {
            return this.httpService.http.patch(this.baseResourceUrl, group.toJson(true), options)
                .map((response) => {
                    return response;
                }).catch(this.handleError);
        } else {
            delete group.id;
            return this.httpService.http.post(this.baseResourceUrl, group.toJson(true), options)
                .map((response) => {
                    return response;
                }).catch(this.handleError);
        }
    }
}
