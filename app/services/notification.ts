import {Injectable} from'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser';
import 'rxjs/add/operator/map';

@Injectable()
export class NotificationService {
	constructor(private _dom: BrowserDomAdapter) {

	};

	show (type, content) {

		var notification = this._dom.createElement('div');
		notification.innerHTML = content;
		notification.classList.add('df-notification', type);


		var notificationEl = this._dom.query('body').appendChild(notification);

		setTimeout(function(argument) {
			notificationEl.remove();
		}, 4000);
	};
}
