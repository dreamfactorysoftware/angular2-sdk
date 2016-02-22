# Introduction

Sample addressbook for Dreamfactory 2.0 written using Angular2.0 and Typescript


# Developement Requirements

- node v4.x.x higher and npm 2.14.7
- to develop independently, without having to put source files in df instance, make sure cors is enabled and necessary permissions are given to services in your df instance

# How to start

```bash
git clone --depth 1 https://github.com/dreamfactorysoftware/angular2-sdk.git
cd angular2-sdk
# paste your dsp_instance_url and app_key in app/config/config.ts
# install the project's dependencies
npm install
# watches your files and uses livereload by default
npm start

# dev build
npm build.dev
# prod build
npm build.prod
```

# Build and deploy to dreamfactory instance
```bash
# make a build
npm build.prod

# this will create prod folder in dist/ which contains the production build
# make a zip of prod folder
# Open dreamfactory instance and in files tab upload the prod.zip to your application folder
# Make sure the launch path of the app is pointing to correct index.html path from prod folder. you can check that in app detail under Apps tab. 
```

# Thanks
- Inspired from angular2-seed project by [Minko Gechev](https://github.com/mgechev)

