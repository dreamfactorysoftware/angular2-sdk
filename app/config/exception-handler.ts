import { ExceptionHandler } from 'angular2/core';


class _ArrayLogger {
	res = [];
	log(s: any): void { this.res.push(s); }
	logError(s: any): void { this.res.push(s); }
	logGroup(s: any): void { this.res.push(s); }
	logGroupEnd() {
		this.res.forEach(error => {
			console.error(error);
		})
	};
}
export class CustomExceptionHandler extends ExceptionHandler {
	constructor() {
		super(new _ArrayLogger(), true);
	}

    call(exception: any, stackTrace: any, reason: string): void {

      if (~[401, 404].indexOf(exception.status)) {
				window.location.hash = '/login';
      } else {
				super.call(exception, stackTrace, reason);
      }
    }
}
