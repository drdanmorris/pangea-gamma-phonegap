#Getting Started

## Step One:  Install Dependencies (Windows & Mac)

The following instructions install the necessary dependencies for running / building the POC app.  You will need to repeat these instruction on both a Windows machine (for primary development and building Android and WP8 apps) and a Mac (for building iOS and optionally Android apps).


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

> The -g option ensures that the package is available globally on your machine (rather than just in the current folder).  On Windows globally installed Node packages are downloaded to *c:\Users\\\<user\>\appdata\Roaming\npm\node_modules*


####Install Grunt
Grunt is a Task Runner which can be used to create automated build processes.  

#####Windows (using Command Prompt)
```
$ npm install -g grunt-cli
```

#####Mac (using Terminal)
```
$ sudo npm install -g grunt-cli
```

===================================

## Step Two:  Create Master Development Environment (Windows)
The following steps create a master development environment on your local Windows machine.


####Download POC Repository
Click the **Download Zip** button to grab a local copy of the POC repository.  Unpack the archive to a location of your choice (e.g., *c:\development\poc\*), abbreviated herein as 'root'.


####Install Node Dependencies
Open a command prompt, navigate to *\\\\root\pangea-gamma-phonegap-master\pangea-gamma* and then run the following command:


```
$ npm install
```

> This will install any Node dependencies listed in the package.json file to a local node_modules folder.


####Build the POC Mobile Web App
Navigate to *\\\\root\pangea-gamma-phonegap-master\pangea-gamma* and run the following command:

```
$ grunt
```

> The Grunt Task Runner will then execute the build process defined in the local gruntfile.  All going well Grunt will output progress entries for various ios, android and android4 tasks and then exit with the entry 'Done, without errors'.


####Launch the Development Web Server
For convenience a Node.JS-based web server is included with the POC.  Navigate to *\\\\root\pangea-gamma-phonegap-master\pangea-gamma* and run the **launch web server** batch file.  All going well the following output will appear:

```
Http Server running at http://localhost:8000/
```


####Launch the Backend View Broker Service
For convenience a Node.JS-based dummy backend View Broker service is included with the POC.  Navigate to *\\\\root\pangea-gamma-phonegap-master\server* and run the **run** batch file.  All going well the following output will appear:

```
WS Server running at 127.0.0.0:8081
```


####Browse the POC Mobile Web App

#####iOS Skin
Launch Chrome and browse to http://localhost:8000/platforms/ios/www/index.html

> You will probably want to open the Developer Tools window (F12) docked to the right-hand side of the browser, and reduce the window height in order to approximate the size of an iPhone screen.  Note that the POC is a single page web app with routing handled via hash tags in the URL.  


#####Android Skin
Open a new Chrome Tab (ctrl-T) and browse to http://localhost:8000/platforms/android/www/index.html


#####Alternate Android Skin
Open a new Chrome Tab (ctrl-T) and browse to http://localhost:8000/platforms/android4/www/index.html


==============================


## Step Three: Build Native Phonegap Apps

In order to build native phonegap applications you need to create the appropriate native SDK projects.  Phonegap can create these for you.


### iOS Phonegap App (Mac)
To build an iOS app you need a Mac with XCode installed.

#### Copy POC to the Build Mac
On the Mac use the Finder to Connect To Server (cmd-K) and enter the smb: url for your local Windows machine (or alternatively a network share where you have deployed the POC).  Once connected copy the POC pangea-gamma directory to a local directory on the Mac (e.g., Home\Documents\Development\POC) - referred herein as 'pocroot'


#### Open Terminal Window
In a Terminal window navigate to *\\\\pocroot\pangea-gamma* in preparation for the following steps.


#### Kill the current iOS platform files
Phonegap doesn't like any foreign files in the platforms folder, so we need to empty this folder before invoking any phonegap commands.


```
pangea-gamma$ rm -R platforms

pangea-gamma$ mkdir platforms
```


#### Build iOS Project

```
pangea-gamma$ sudo phonegap build ios
```

> Phonegap will then deploy a build to the platforms/ios folder.  In here you will find the pangea-gamma.xcodeproj which you can later open for debugging and building the POC app.  


#### Change Phonegap File Ownership
By default you wont have permissions on the files created by phonegap. To change ownership back to your local user run the following commands:

```
pangea-gamma$ ls -al platforms/ios
```
> You should see that root owns all the files

To address this:

```
pangea-gamma$ sudo chown -R \<local user\> platforms

root$ cd platforms/ios

ios$ ls -al
```
> You should now see that \<local user\> now owns all the files, and you should have permission to open the xcodeproj


#### Perform Our Custom POC Build
We need to peform a custom build in order to compile our .styl scripts to CSS, and take care of a few other miscellaneous house-keeping items. 

```
pangea-gamma$ grunt ios
```

> Platforms/ios will now contain the appropriate compiled source files.

#### Build Native App with XCode
You should now be ready to build your phonegap iOS application. Open the pangea-gamma.xcodceproj file in XCode, Build (cmd-B) and then Run (cmd-R) on either the simulator or your provisioned iOS device.

