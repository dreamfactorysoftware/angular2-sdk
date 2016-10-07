import {Contact} from './contact';
import {Group} from './group';


export class ContactGroup {
	constructor(
		public id: string,
		public contact: Contact = null,
		public group: Group = null
	) { }


	static fromJson(json: any) {
		if (!json) return;

		return new ContactGroup(
			json.id,
			new Contact(json.contact_id),
			new Group(json.contact_group_id)
		);
	}


	toJson(stringify?: boolean): any {
		var doc = {
			id: this.id,
			contact_id: this.contact && this.contact.id,
			contact_group_id: this.group && this.group.id
		};

		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}

}
