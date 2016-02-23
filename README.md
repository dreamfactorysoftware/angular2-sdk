Address Book for Angular2
==========================

This repo contains a sample address book application for Angular2 that demonstrates how to use the DreamFactory REST API. It includes new user registration, user login, and CRUD for related tables.

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
    - From the Apps tab in the admin console, click Import and click 'Address Book for Angular2' in the list of sample apps. The Address Book package contains the application description, source code, schemas, and sample data.
    - Leave storage service and folder blank. It will use the default local file service named 'files'.
    - Click the Import button. If successful, your app will appear on the Apps tab. You may have to refresh the page to see your new app in the list.
    
- Load the app from the instance.
    - You can't run this app locally by opening index.html in the browser due to cross origin restrictions with loading templates.
    - Launch the app directly from the Apps tab in the admin console.  Leave INSTANCE_URL in the code set to empty string.

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


#Additional Resources

More detailed information on the DreamFactory REST API is available [here](http://wiki.dreamfactory.com/DreamFactory/API).

The live API documentation included in the admin console is a great way to learn how the DreamFactory REST API works.