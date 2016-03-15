import {Component, ViewEncapsulation} from 'angular2/core';
import {
  Router,
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';

import {HomeCmp} from '../home/home';
import {AboutCmp} from '../about/about';
import {ContactListCmp} from '../contact-list/contact-list';
import {ContactCmp} from '../contact/contact';
import {ContactInfoCmp} from '../contact-info/contact-info';
import {GroupListCmp} from '../group/group-list';
import {GroupCmp} from '../group/group';
import {LoginCmp} from '../login/login';
import {RegisterCmp} from '../register/register';

import {BaseHttpService} from '../../services/base-http';

@Component({
  selector: 'app',
  templateUrl: './components/app/app.html',
  styleUrls: ['./components/app/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES],
  providers: [BaseHttpService]
})
@RouteConfig([
  { path: '/', component: ContactListCmp, as: 'ContactList' },
  { path: '/contacts/new', component: ContactCmp, as: 'NewContact' },
  { path: '/contacts/:id', component: ContactCmp, as: 'Contact' },
  { path: '/contact-info/new/:contactId', component: ContactInfoCmp, as: 'NewContactInfo' },
  { path: '/contact-info/:id/:contactId', component: ContactInfoCmp, as: 'ContactInfo' },
  { path: '/groups', component: GroupListCmp, as: 'GroupList' },
  { path: '/groups/new', component: GroupCmp, as: 'NewGroup' },
  { path: '/groups/:id', component: GroupCmp, as: 'Group' },
  { path: '/login', component: LoginCmp, as: 'Login' },
  { path: '/register', component: RegisterCmp, as: 'Register' },
  { path: '/about', component: AboutCmp, as: 'About' }
])
export class AppCmp {

  hideHeader: boolean = false;
  constructor (private httpService: BaseHttpService, private _router:Router) {
    var self = this;
    _router.subscribe((path) => {
      if (path === 'login' || path === 'register') {
        self.hideHeader = true;
      } else {
        self.hideHeader = false;
      }
    });
  }

  logout () {
    this.httpService.http._defaultOptions.headers.set('X-Dreamfactory-Session-Token', '');
    localStorage.setItem('session_token', '');
    this._router.navigate(['Login']);
  }
}
