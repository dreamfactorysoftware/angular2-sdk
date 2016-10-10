import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';
import { URLSearchParams } from 'angular2/http';

import { Group } from '../../models/group';
import { GroupService } from '../../services/group';
import { ContactService } from '../../services/contact';
import { BaseHttpService } from '../../services/base-http';
import { OrderByPipe  } from '../../models/OrderBy';



@Component({    
    templateUrl: './components/group/group-list.html',    
    providers: [GroupService, BaseHttpService, ContactService],
    directives: [ROUTER_DIRECTIVES],
    pipes: [OrderByPipe]
})

export class GroupListCmp {
    public groups: Group[] = [];
    shadowImage: string = 'https://image.freepik.com/free-icon/male-user-shadow_318-34042.png';

    constructor(private groupService: GroupService, private router: Router) {        
        var token = localStorage.getItem('session_token');
        if (token === '' || token === null) {
            this.logout();
        } else {
            
        }
    }
    
ngAfterViewInit() {
  setTimeout(() => {
    this.getList();
  }, 1);
}
    logout() {
        localStorage.setItem('session_token', '');
        this.router.navigate(['Login']);
    }
    getList() {
        let self = this;
        let params = new URLSearchParams();
        params.set('order', 'name+ASC');
        this.groupService.query(params)
            .subscribe((groups: Group[]) => {
                self.groups = groups;
            });
    }

    remove(groupId) {
    	var token = localStorage.getItem('session_token');
        if (token ==='' || token === null) {
            this.logout(); 
        }
        var self = this;
        this.groupService.remove(groupId)
            .subscribe(() => {
                self.groups = self.groups.filter((item) => {
                    return item.id !== groupId;
                });
            });
    }

    show(groupId) {
        this.router.navigate(['/Group', { id: groupId }]);
    }
}
