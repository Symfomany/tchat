
### Overview

* MEAN App buikt in Node, Angular, Express, SOcket.IO & MongoDB
+ Promises with $q library https://github.com/kriskowal/q




### Angular Style Guide

+ Angular Style Guide By John Papa
+ Mongo DB with Mongoose & Express for backend
+ Look Nodemon to reboot webserver on change serverside node  available here https://github.com/remy/nodemon
+ Look at RobotMongo here https://robomongo.org/


### Installation

```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start
npm install && bower install
```


### Disable CORS for broswer
chromium-browser --disable-web-security


###  Launch

You can start server with 

``` 
    npm start
```

In dev mode, use nodemon

```
 nodemon app.js
```


###  Architecture

+ app/: Angular App (config,controllers, directives, factories, partials, services, routing, filters...)
+ bower_components/: Bower Deps (JSS/CSS lib)
+ images/: All images
+ models/: All models to handle collections of Mongo (Active Records)
+ node_modules/: All deps on Node 
+ styles: All Sass & production static stylesheet files
+ index.html: Entry point of App
+ app.js: Serverside wth Node + Express + Mongoose


###  Evolution

+ Install & configure Webpack



###  BONUS ZONE 


-use compass sass + gulp
-use templates 
-make a nice interface with the css framework you'd like  animate.css
-use a router (ngRoute or uiRouter)
-implement custom messages (toastr-like)
-implement signup/connection/disconnection interface
-handle multiple rooms
-show users and show if they spoke recently or not
-show beautiful dates and auto-scroll when you speak
-notify the browser if someone spoke
-play sounds !!
-play chess !!
-play go !!
-build an ia to play go !!
-or maybe chess...it'd be a lot easier
