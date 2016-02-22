import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import * as constants from '../config/constants';


@Injectable()
export class BaseHttpService {
	
	static token:string = '';

	http: Http;

	constructor(http: Http) {
		this.http = http;
	}

}

