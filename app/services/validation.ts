export class ValidationService {

    static emailValidator(control) {
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (emailPattern.test(control.value)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static phoneNumberValidator(control) {
        var phPattern = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
        if (phPattern.test(control.value)) {
            return null;
        } else {
            return { 'invalidphnumber': true };
        }
    }

    static zipCodeValidator(control) {
        var zipPattern = /^\d{5}(?:[-\s]\d{4})?$/;
        if (zipPattern.test(control.value)) {
            return null;
        } else {
            return { 'invalidZipcode': true };
        }
    }
}
