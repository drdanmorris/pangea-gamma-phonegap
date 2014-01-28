##Getting Started

####Install Node.JS
Node.JS is a platform built on Chrome's JS runtime for building fast, scalable network applications.  **Phonegap** is built on Node.JS, as is the **Grunt** Task Runner.  We also have a web server and back-end View Broker which are built on Node.JS.

To install node visit http://nodejs.org/ and hit the Install button.

Once installed you will be able to execute Node.JS programs from the command-line.  You can also download Node Packages using the Node Package Manager (npm).


####Install Phonegap
Phonegap is installed using npm:

#####Windows
```
c:\npm install -g phonegap
```

#####Mac
```
c:\sudo npm install -g phonegap
```

> The -g option ensures that the package is available globally on your machine (rather than just in the current folder).  On Windows globally installed Node packages are downloaded to *c:\Users\your_user_name\appdata\Roaming\npm\node_modules*


####Install Grunt
Grunt is a Task Runner which can be used to create automated build processes.  

#####Windows
```
c:\npm install -g grunt-cli
```

#####Mac
```
c:\sudo npm install -g grunt-cli
```


####Download POC Repository
Click the **Download Zip** button to grab a local copy of the POC repository.  Unpack the archive to *c:\development\poc* (or a suitable alternative of your choice).


####Install POC Node Dependencies
Open a command prompt, navigate to *c:\development\poc\pangea-gamma-phonegap-master\pangea-gamma* and then run the following command:


#####Windows
```
c:\npm install
```

#####Mac
```
c:\sudo npm install
```

> This will install any Node dependencies listed in the package.json file to a local node_modules folder.







