
export enum ContactInfoTypes {
	home,
	work,
	mobile
}

export class ContactInfo {
	constructor (
			public id:string,
			public contactId:string = null,
			public address:string = null,
			public city:string = null,
			public state:string = null,
			public zip:string = null,
			public country:string = null,
			public email:string = null,
			public infoType:ContactInfoTypes = null,
			public phone:string = null
	) { }


	static fromJson (json:any) {
		if (!json) return;

		return new ContactInfo (
			json.id,
			json.contact_id,
			json.address,
			json.city,
			json.state,
			json.zip,
			json.country,
			json.email,
			json.info_type,
			json.phone
		);
	}


	toJson (stringify?: boolean): any {
		var doc = {
			id: this.id,
			contact_id: this.contactId,
			address: this.address,
			city: this.city,
			state: this.state,
			zip: this.zip,
			country: this.country,
			email: this.email,
			info_type: this.infoType,
			phone: this.phone
		};

		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}

}
