Address Book for Angular 2
==========================

This repo contains a sample address book application for Angular 2 that demonstrates how to use the DreamFactory REST API. It includes new user registration, user login, and CRUD for related tables.

#Getting DreamFactory on your local machine

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

- Import the package file for the app.
    - From the Apps tab in the admin console, click Import and click 'Address Book for Angular 2' in the list of sample apps. The Address Book package contains the application description, source code, schemas, and sample data.
    - Leave storage service and folder blank. It will use the default local file service named 'files'.
    - Click the Import button. If successful, your app will appear on the Apps tab. You may have to refresh the page to see your new app in the list.
    
- Load the app from the instance.
    - You can't run this app locally by opening index.html in the browser due to cross origin restrictions with loading templates.
    - Change window.instanceUrl and window.appKey in index.html. Leave windiw.instanceUrl empty if running directly from apps tab. You can find value for window.appKey in apps tab under the add_angular2 app detail page.

- Make your app files public.
    - Figure out where your app files are stored. If you used the default storage settings to import the app, it'll be the default local file service named 'files'.
    - Go to the Files tab in the admin console. Find your file service. Double click and find the folder for your app, e.g., 'AddressBookForAngularJS'.
    - Go to the Services tab in the admin console and click the 'files' service. Click the Config tab and add the app folder name 'AddressBookForAngularJS' as a public path. Now select the relevant container from the Container drop down. If you used the default storage settings to import the app then select "local" from the drop down list. Save your changes.

- Make sure you have a SQL database service named 'db'. Most DreamFactory instances have a default 'db' service for SQLite. You can add one by going to the Services tab in the admin console and creating a new SQL service. Make sure you set the name to 'db'.


#How develop the project on your local machine 

##Prerequisites

- node v4.x.x higher and npm 2.14.7
- to develop independently, without having to put source files in df instance, make sure cors is enabled and necessary permissions are given to services in your df instance

##Run project
```bash
git clone --depth 1 https://github.com/dreamfactorysoftware/angular2-sdk.git
cd angular2-sdk/angular2-sdk
# paste your dsp_instance_url and app_key in app/config/config.ts
# install the project's dependencies
npm install
# watches your files and uses livereload by default
npm start

```

##Build and deploy to dreamfactory instance
```bash
# make a build, this will create prod folder in dist/ which contains the production build and zip file in the root folder

npm build.prod

# Open dreamfactory instance and in files tab upload the angular2-sdk.zip to your application folder
# Make sure the launch path of the app is pointing to correct index.html path from angular2-sdk folder in dreamfactory filemanager. You can check that in app detail under Apps tab. 
```

#Running the Address Book app in dreamfactory

You can launch the app from the Apps tab in the admin console.

When the app starts up you can register a new user, or log in as an existing user. Currently the app does not support registering and logging in admin users.


#Example API calls 


The dreamfactory for Angular 2 has a base http service, an interceptor and a login module
which takes care of attaching authorization headers to every outgoing
request. Hence BaseHttpRequest module should be imported in every
component that wants to make api calls.


Angular 2 does not encourage to use globals hence as a workaround in the
BaseHttpService we have a http object which will be used for every http
api call. The login module will have following code which takes care
of setting default headers for all requests

```javascript
this.httpService.http._defaultOptions.headers.set('X-Dreamfactory-Session-Token',
data && data.session_token);
```

where httpService is a BaseHttpService object.


##Fetching data from server

In the current project we have separated the model, service and the
controller. We include all the business logic in services. It is
always recommended to keep the controller dumb and only interact with
UI. The whole part of interacting with UI should be in controllers and business logic should be
delegated to services. For example see following definition of a  model and a service which takes
care of getting all contacts using an http api call:

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
and in the controller or the in angular 2 we should say component we will
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

the getList method creates a URLSearchParams object which has the url
params to be sent on the request. These params will be sent to the
service which in turn will send to server in form of query params.



##Creating/Updating a record

We will extend out contact service to include one more function which
takes care of creating/updating a record

```javascript
save (contact: Contact) {
  if (contact.id) {
    return this.httpService.http.put(constants.DSP_INSTANCE_URL + '/api/v2/db/_table/contact/' + contact.id, contact.toJson(true))
      .map((data) => {
        return data;
      });
  } else {
      return this.httpService.http.post(constants.DSP_INSTANCE_URL + '/api/v2/db/_table/contact', contact.toJson(true))
        .map((data) => {
          return data;
        });
  }
}
```

the above method takes a contact object as param and decides whether too 'PUT' or 'POST' based on whether the object has id or not.
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
i
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
