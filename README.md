#Getting Started

The following instructions allow you to create a local development platform to run the POC web app.  You will need to repeat these instruction on both a Windows machine (for primary development and building Android and WP8 apps) and a Mac (for building iOS and optionally Android apps).


####Install Node.JS
Node.JS is a platform built on Chrome's JS runtime for building fast, scalable network applications.  **Phonegap** is built on Node.JS, as is the **Grunt** Task Runner.  We also have a web server and back-end View Broker which are built on Node.JS.

To install node visit http://nodejs.org/ and hit the Install button.

Once installed you will be able to execute Node.JS programs from the command-line.  You can also download Node Packages using the Node Package Manager (npm).


####Install Phonegap
Phonegap is installed using npm:

#####Windows
```
$ npm install -g phonegap
```

#####Mac
```
$ sudo npm install -g phonegap
```

> The -g option ensures that the package is available globally on your machine (rather than just in the current folder).  On Windows globally installed Node packages are downloaded to *c:\Users\your_user_name\appdata\Roaming\npm\node_modules*


####Install Grunt
Grunt is a Task Runner which can be used to create automated build processes.  

#####Windows
```
$ npm install -g grunt-cli
```

#####Mac
```
$ sudo npm install -g grunt-cli
```



####Download POC Repository
Click the **Download Zip** button to grab a local copy of the POC repository.  Unpack the archive to a location of your choice (e.g., *c:\development\poc\*), abbreviated herein as ROOT.



####Install POC Node Dependencies
Open a command prompt, navigate to *\\ROOT\pangea-gamma-phonegap-master\pangea-gamma* and then run the following command:


#####Windows
```
$ npm install
```

#####Mac
```
$ sudo npm install
```

> This will install any Node dependencies listed in the package.json file to a local node_modules folder.


####Build the POC Mobile Web App
Navigate to *\\ROOT\pangea-gamma-phonegap-master\pangea-gamma* and run the following command:


#####Windows
```
c:\grunt
```

#####Mac
```
c:\grunt
```

> The Grunt Task Runner will then execute the build process defined in the local gruntfile.


####Launch the Development Web Server
For convenience a Node.JS-based web server is included with the POC.  Navigate to *\\ROOT\pangea-gamma-phonegap-master\pangea-gamma* and run the **launch web server** batch file.  All going well the following output will appear:

```
Http Server running at http://localhost:8000/
```


####Launch the Backend View Broker Service
For convenience a Node.JS-based dummy backend View Broker service is included with the POC.  Navigate to *\\ROOT\pangea-gamma-phonegap-master\server* and run the **run** batch file.  All going well the following output will appear:

```
WS Server running at 127.0.0.0:8081
```


####Browse the POC Mobile Web App
Launch Chrome and browse to http://localhost:8000/platform/ios/index.html

