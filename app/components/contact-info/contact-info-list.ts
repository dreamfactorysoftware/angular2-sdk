import { Component } from 'angular2/core';
import { NgClass } from 'angular2/common';
import { ROUTER_DIRECTIVES, Router, RouteParams } from 'angular2/router';
import { URLSearchParams } from 'angular2/http';

import { ContactInfo } from '../../models/contact-info';
import { ContactInfoService } from '../../services/contact-info';
import { BaseHttpService } from '../../services/base-http';




@Component({
    selector: 'contact-info-list',
    templateUrl: './components/contact-info/contact-info-list.html',
    styleUrls: ['./components/contact-info/contact-info.css'],
    providers: [ContactInfoService, BaseHttpService],
    directives: [ROUTER_DIRECTIVES, NgClass]
})

export class ContactInfoListCmp {
    public contactInfo: ContactInfo[] = [];
    public contactInfoFields: any[] = [
        { label: 'ID', key: 'id' },
        { label: 'Type', key: 'infoType', mobileShow: true },
        { label: 'Phone', key: 'phone' },
        { label: 'Email', key: 'email' },
        { label: 'Address', key: 'address' },
        { label: 'City', key: 'city' },
        { label: 'State', key: 'state' },
        { label: 'Country', key: 'country' },
    ];
    params: URLSearchParams = new URLSearchParams();

    constructor(private contactInfoService: ContactInfoService, private routeParams: RouteParams, private router: Router) {
        var token = localStorage.getItem('session_token');
        if (token === '' || token === null) {
            this.logout();
        } else {
            this.params.set('filter', 'contact_id=' + routeParams.get('id'));
            this.getList();
        }

    };
    logout() {
        localStorage.setItem('session_token', '');
        this.router.navigate(['Login']);
    };
    getList() {
        let self = this;
        this.contactInfoService.query(this.params)
            .subscribe((contactInfo: ContactInfo[]) => {
                self.contactInfo = contactInfo;
            });
    };

    edit(id) {
        this.router.navigate(['/ContactInfo', { id: id, contactId: this.routeParams.get('id') }]);
    };

    add() {
        this.router.navigate(['/NewContactInfo', { contactId: this.routeParams.get('id') }]);
    }

    remove(id) {
        let self = this;
        this.contactInfoService.remove(id)
            .subscribe((id: any) => {
                self.contactInfo = self.contactInfo.filter((item) => item.id !== id);
            });
    };
}
