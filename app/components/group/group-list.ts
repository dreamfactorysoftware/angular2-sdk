import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {URLSearchParams} from 'angular2/http';

import {Group} from '../../models/group';
import {GroupService} from '../../services/group';
import {ContactService} from '../../services/contact';
import {BaseHttpService} from '../../services/base-http';



@Component({
	selector: 'group-list',
	templateUrl: './components/group/group-list.html',
	styleUrls: ['./components/group/group.css'],
	providers: [GroupService, BaseHttpService, ContactService],
	directives: [ROUTER_DIRECTIVES]
})

export class GroupListCmp {
	public groups: Group[] = [];
	shadowImage: string = 'https://image.freepik.com/free-icon/male-user-shadow_318-34042.png';

	constructor(private groupService: GroupService, private router: Router) {
		this.getList();
	}

	getList() {
		let self = this;
		let params = new URLSearchParams();
		params.set('order', 'name+ASC');
		this.groupService.query(params)
			.subscribe((groups: Group[]) => {
				self.groups = groups
			});
	}

	show(groupId) {
		this.router.navigate(['/Group', { id: groupId }]);
	}
}
