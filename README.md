Address Book for Angular 2
==========================

This repo contains a sample address book application for Angular 2 that demonstrates how to use the DreamFactory REST API. It includes new user registration, user login, and CRUD for related tables.

#Getting a DreamFactory instance

To download and install DreamFactory, follow the instructions [here](http://wiki.dreamfactory.com/DreamFactory/Installation). Alternatively, you can create a [free hosted developer account](http://www.dreamfactory.com) at www.dreamfactory.com if you don't want to install DreamFactory locally.

#Configuring your DreamFactory instance to run the app

- Enable [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for development purposes.
    - In the admin console, navigate to the Config tab and click on CORS in the left sidebar.
    - Click Add.
    - Set Origin, Paths, and Headers to *.
    - Set Max Age to 0.
    - Allow all HTTP verbs and check the Enabled box.
    - Click update when you are done.
    - More info on setting up CORS is available [here](http://wiki.dreamfactory.com/DreamFactory/Tutorials/Enabling_CORS_Access).

- Create a default role for new users and enable open registration
    - In the admin console, click the Roles tab then click Create in the left sidebar.
    - Enter a name for the role and check the Active box.
    - Go to the Access tab.
    - Add a new entry under Service Access (you can make it more restrictive later).
        - set Service = All
        - set Component = *
        - check all HTTP verbs under Access
        - set Requester = API
    - Click Create Role.
    - Click the Services tab, then edit the user service. Go to Config and enable Allow Open Registration.
    - Set the Open Reg Role Id to the name of the role you just created.
    - Make sure Open Reg Email Service Id is blank, so that new users can register without email confirmation.
    - Save changes.

- Make sure you have a SQL database service named 'db'. Most DreamFactory instances have a default 'db' service for SQLite. You can add one by going to the Services tab in the admin console and creating a new SQLite service. Make sure you set the name to 'db'.

- Import the package file for the app.
    - From the Apps tab in the admin console, click Import and click 'Address Book for Angular 2' in the list of sample apps. The Address Book package contains the application description, schemas, and sample data.
    - Leave storage service and folder blank. You will be running the app locally on your machine so no file storage is required.
    - Click the Import button. If successful, your app will appear on the Apps tab. You may have to refresh the page to see your new app in the list.

- Edit your app API key and instance URL
    - Edit app/config/constants.ts and set DREAMFACTORY_API_KEY to the key for your new app. The API key is shown on the app details in the Apps tab of the admin console. Set DREAMFACTORY_INSTANCE_URL to the base URL for your DreamFactory instance.

#How to run the project on your local machine

##Prerequisites

- node v4.x.x higher and npm 2.14.7

```bash
git clone https://github.com/dreamfactorysoftware/angular2-sdk.git
cd angular2-sdk
# paste your DREAMFACTORY_INSTANCE_URL and DREAMFACTORY_API_KEY in app/config/constants.ts
npm install -g nativescript
npm install -g typescript
npm install
npm start
```

#Example API calls 

This app has a base HTTP service, an interceptor, and a login module
which takes care of attaching authorization headers to every outgoing
request. Therefore the BaseHttpRequest module should be imported in every
component that wants to make API calls.

Angular 2 does not encourage the use of globals so as a workaround in the
BaseHttpService we have an HTTP object which will be used for every HTTP
API call. The login module will have the following code which takes care
of setting the default headers for all requests.

```javascript
this.httpService.http._defaultOptions.headers.set('X-Dreamfactory-Session-Token',
data && data.session_token);
```

where httpService is a BaseHttpService object.

##Fetching data from server

In the current project we have separated the model, service, and the
controller. We include all the business logic in services. It is
always recommended to keep the controller dumb and only interact with the
UI. Interaction with the UI should be in the controllers and business logic should be
delegated to the services. For example see the following definition of a model and a service which takes
care of getting all contacts using an HTTP API call:

```javascript
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
```

```javascript
@import {Contact} from '../models/contact.ts';
@import {BaseHttpService} from './BaseHttpService';

export class ContactService {
  constructor (private httpService: BaseHttpService) {
  }

  query (params: UrlSerarchParams) {
    this.httpService.http.get('/api/v2/_db/table/contacts', { search: params })
    .map((response) => {
      return response.json().resource.map((item) {
        return Contact.fromJson(item);
      })
    });
  }
}
```

and in the controller or the in Angular 2 we should specify which component we will
subscribe to the above service. 

```javascript 

@Component({
  selector: 'contact-list',
  templateUrl: './components/contact-list/contact-list.html',
  styleUrls: ['./components/contact-list/contact-list.css'],
  providers: [ContactService, BaseHttpService],
  directives: [ROUTER_DIRECTIVES]
})

export class ContactListCmp {
  public contacts: Contact[] = [];
          
    constructor (private contactService: ContactService, private
    router: Router) {
      this.getList();
    }
          
    getList () {
      let self = this;
      let params: URLSearchParams = new URLSearchParams();
      params.set('order', 'last_name+ASC');
          
      this.contactService.query(params)
        .subscribe((contacts: Contact[]) => {
          self.contacts = contacts
        });
    }
}
```

The getList method creates a URLSearchParams object which has the url
params to be sent on the request. These params will be sent to the
service which in turn will send to server in the form of query params.

##Creating/Updating a record

We will extend out contact service to include one more function which
takes care of creating/updating a record.

```javascript
save (contact: Contact) {
  if (contact.id) {
    return this.httpService.http.put(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_table/contact/' + contact.id, contact.toJson(true))
      .map((data) => {
        return data;
      });
  } else {
      return this.httpService.http.post(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_table/contact', contact.toJson(true))
        .map((data) => {
          return data;
        });
  }
}
```

The above method takes a contact object as a param and decides whether to 'PUT' or 'POST' based on whether the object has an id or not.

```javascript
save () {
  var self = this;
  var isNew = !!this.contact.id;

  this.contactService.save(this.contact)
    .subscribe((response) => {
      if (isNew)
        alert('New contact created');
      else
        alert('Contact updated');
    })
}
```


##Deleting records

```javascript
remove (id: string) {
  return this.httpService.http
    .delete(this.baseResourceUrl + '/' + id)
    .map((response) => {
      var result: any = response.json();
      return result.id;
    });
}
```

#Additional Resources

More detailed information on the DreamFactory REST API is available [here](http://wiki.dreamfactory.com/DreamFactory/API).

The live API documentation included in the admin console is a great way to learn how the DreamFactory REST API works.
