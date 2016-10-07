
export class Contact {
	constructor (
			public id:string,
			public firstName:string = '',
			public lastName:string = '',
			public image:string = '',
			public skype:string = '',
			public twitter:string = '',
			public notes:string = ''
	) { }


	static fromJson (json:any) {
		if (!json) return;

		return new Contact (
			json.id,
			json.first_name,
			json.last_name,
			json.image_url,
			json.skype,
			json.twitter,
			json.notes
		);
	}


	toJson (stringify?: boolean):any {
		var doc = {
			id: this.id,
			first_name: this.firstName,
			last_name: this.lastName,
			image_url: this.image,
			skype: this.skype,
			twitter: this.twitter,
			notes: this.notes
		};

		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}

}
