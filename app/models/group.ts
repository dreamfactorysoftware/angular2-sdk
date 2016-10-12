
export class Group {
	constructor(
		public id: string = null,
		public name: string = null
	) { }


	static fromJson(json: any) {
		if (!json) return;

		return new Group(
			json.id,
			json.name
		);
	}


	toJson(stringify?: boolean): any {
		var doc = {
			id: this.id,
			name: this.name
		};

		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}

}
