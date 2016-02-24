import {provide, Injector, Inject} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ExceptionHandler} from 'angular2/src/facade/exception_handler';
import {Router, ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS, Http, RequestOptions} from 'angular2/http';
import {AppCmp} from './components/app/app';
import {DfRequestOptions} from './config/interceptors';
import {CustomExceptionHandler} from './config/exception-handler';

bootstrap(AppCmp, [
		ROUTER_PROVIDERS,
		HTTP_PROVIDERS,
		provide(LocationStrategy, { useClass: HashLocationStrategy }),
		provide(RequestOptions, { useClass: DfRequestOptions }),
		provide(ExceptionHandler, { useClass: CustomExceptionHandler }),
		provide(Window, { useValue: window })
]);

// In order to start the Service Worker located at "./sw.js"
// uncomment this line. More about Service Workers here
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
// if ('serviceWorker' in navigator) {
//   (<any>navigator).serviceWorker.register('./sw.js').then(function(registration) {
//     console.log('ServiceWorker registration successful with scope: ',    registration.scope);
//   }).catch(function(err) {
//     console.log('ServiceWorker registration failed: ', err);
//   });
// }
