import {HTTP_PROVIDERS, Headers, Http, BaseRequestOptions} from 'angular2/http';
import * as constants from './constants';


export class DfRequestOptions extends BaseRequestOptions {

	constructor () {
		super();
		this.headers.set('X-Dreamfactory-API-Key' ,constants.DREAMFACTORY_API_KEY);

		var token = localStorage.getItem('session_token');
		if (token) {
			this.headers.set('X-Dreamfactory-Session-Token', token);	
		}
	}
}