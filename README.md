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

Alternatively (recommended) you can click the **Clone in Desktop** button and follow the instructions for setting up the Git Client (if not installed already).  This approach will make it easier to later resync your local repository with the master server repository.


####Install Node Dependencies
Open a command prompt, navigate to *\\\\root\pangea-gamma-phonegap-master\pangea-gamma* and then run the following command:


```
$ npm install
```

> This will install any Node dependencies listed in the package.json file to a local node_modules folder.


####Tweak your Local Configuration 
Open the *\\\\root\pangea-gamma-phonegap-master\pangea-gamma\www\js\services.js* file and update the **url** property of the websocket configuration to the IP address of your local server.



####Build the POC Mobile Web App
Navigate to *\\\\root\pangea-gamma-phonegap-master\pangea-gamma* and run the following command:

```
$ grunt
```

> The Grunt Task Runner will then execute the build process defined in the local gruntfile.  All going well Grunt will output progress entries for various ios, android and android4 tasks and then exit with the entry 'Done, without errors'.


###Test the Installation
The POC can be viewed as a standard Mobile Web Application by hosting the pangea-gamma folder in a web server and browsing to the various platform index.html pages using a web browser.  However, as the bootstrapping of the AngularJS application is triggered by the document.deviceready event a phonegap-aware browser must be used.  The Chrome Ripple Emulator extension is currently the best (and in fact only) choice for this.  To install this extension point your Google Chrome browser to the <a href="https://chrome.google.com/webstore/detail/ripple-emulator-beta/geelfhphabnejjhdalkjhgipohgpdnoc?hl=en">Google Web Store</a> and click the Add To Chrome button.  Once done you can enable Ripple on a per-page basis by clicking the Ripple icon to the right of the address bar.


####Launch the Development Web Server
For convenience a Node.JS-based web server is included with the POC.  Navigate to *\\\\root\pangea-gamma-phonegap-master\pangea-gamma* and run the **launch web server** batch file.  If installed correctly the following output will appear:

```
Http Server running at http://localhost:8000/
```

Note:  you could technically create a new IIS virtual directory pointing to the pangea-gamma folder. However, please be advised that the above dev web server has helpful logic to exlude certain JS files which would break the web app in a desktop environment.  NodeJS way cooler than IIS too.


####Launch the Backend View Broker Service
For convenience a Node.JS-based dummy backend View Broker service is included with the POC.  Navigate to *\\\\root\pangea-gamma-phonegap-master\server* and run the **run** batch file.  All going well the following output will appear:

```
WS Server running at 127.0.0.0:8081
```


####Browse the POC Mobile Web App



#####iOS Skin
Launch Chrome, browse to http://localhost:8000/platforms/ios/www/index.html (or alternatively, browse to http://localhost:8000 and then drill-down to platforms > ios > www > index.html) and (first time only) click the Ripple icon and subsequent Enable button.

> If you like you can still use the (F12) Developer Tools for debugging, etc.  Just be aware of the boiler-plate Ripple content surrounding the actual emulated application content.


#####Android Skin
As above, but browse to http://localhost:8000/platforms/android/assets/www/index.html, noting the extra assets folder for android.


#####Alternate Android Skin
An alternative 'android 4' skin can be enabled by running the following command in the **pangea-gamma** folder:

```
$ grunt android4
```



==============================


## Step Three: Build Native Phonegap Apps

In order to build native phonegap applications you need to create the appropriate native SDK projects.  Phonegap can create these for you.


### iOS Phonegap App (Mac)
To build an iOS app you need a Mac with XCode installed.


#### Retrieve Repository
The preferred option is to retrieve the repo via git:

```
git clone https://github.com/drdanmorris/pangea-gamma-phonegap
```
> If git isn't installed you can find the MacOS git installer <a ref="http://git-scm.com/download/mac">here</a>

Once cloned you can update your local repo via:

```
git fetch --all
git reset --hard origin/master
```
> This will resync your local repo with the remote repo, blowing away any local changes you may have made.  


**Note:** If you encounter any access denied errors you can run the following to change ownership to you:

```
cd ..
sudo chown -R <username> pangea-gamma
```

#### Open Terminal Window
In a Terminal window navigate to *\\\\pocroot\pangea-gamma* in preparation for the following steps.


#### Build iOS Project (Grunt) NEW

To start from a clean slate run:

```
$ grunt reset
```


Install common plugins (yes, we install plugins *before* we install the platform):
```
$ grunt add-plugins
```
> This will install the required plugins.



Install the iOS platform:

```
$ grunt add-ios
```
> This will create a new iOS platform in the platforms folder.




Install www content: 

```
$ grunt ios
```
> This will update the platform/ios/www folder from the master www.  This command can be re-run whenever you require a platform resync from the master www.



#### Fix iOS Project (Grunt)
If you encounter a build issue with your XCode project due to missing Plugin files and configuration, then you should be able to fix these issues by running:

```
$ grunt fix_ios_plugins
```
> This will copy the missing .h and .m plugin files to the Plugin folder, and insert the correct plugin configuration entry in the root config.xml.


#### Build Native App with XCode
You should now be ready to build your phonegap iOS application. Open the pangea-gamma.xcodceproj file in XCode, Build (cmd-B) and then Run (cmd-R) on either the simulator or your provisioned iOS device.


### Android Phonegap Apps (PC)
To build an android app you need a Mac or PC with the Android SDK installed.  Presumably you would use a PC. 


#### Open Command Prompt
Explore to *\\\\pocroot\pangea-gamma* and run the opencmd batch script.


#### Build Android / WP8 Projects (Grunt)


To start from a clean slate run:

```
$ grunt reset
```
> Note: you will need to re-install both android and wp8 (when available) after doing a **grunt reset** (assuming they are both installed on the same build machine).


Install the common plugins:

```
$ grunt add-plugins
```

Install the android-specific plugins:

```
$ grunt add-plugins-android
```

Install the android platform:

```
$ grunt add-android
```
> This will create a new android platform in the platforms folder.


Install the www content:

```
$ grunt android
```

> Note that we will eventually employ the use of a **watch** task to automatically call **grunt** when the local master www content changes.  The **grunt** command (no args) will invoke the **grunt android**, **grunt ios** and (when available) the **grunt wp8** tasks.  This means your platform www content should always stay synchronised with your master www.



#### Create Eclipse Project
To install the POC on either an Android emulator or device you need to launch the android build from Eclipse.

- Launch the version of Eclipse that was installed as part of the Android SDK.
- Select File > New Project
- Select Android | Android Project from Existing Code
- Browse to the pangea-gamma\platforms\android folder


#### Run POC on Emulator
Android emulators are painfully slow. Your best bet is to deploy and test the POC on an actual device. However, if you do require the use of an android emulator I would stronly recommend against using the AVD Manager (installed as part of the Android Tools).  Instead try the <a href="http://www.genymotion.com/">Genymotion</a> Android Emulator which is considerably faster (but still fairly sluggish compared to the iOS simulator).  You need to create an account in order to use the free version of Genymotion.


#####Create Genymotion Emulator
Android uses *emulators* rather than simulators.  An emulator runs slower and requires a bit more configuration effort compared to a simulator.  Unlike the iOS simulator - which you launch from scratch every time you start a new run/debug session - an android emulator is launched independently (by you) and should remain running.  You tend not to stop and start an android emulator very often.  The android SDK will attach to the emulator at the beginning of a run/debug session and detach at the conclusion of the session.

To create an Emulator (virtual device) launch Genymotion and click the Add button.  Follow the instructions to select your desired handset dimensions and android platform version / API level.  Currently the latest android version is 4.4.2 (API level 19).  Once created double-click the virtual device to start/play it.

Once the virtual device has started you can unlock it and then run the app on the device by selecting the pangeagamma folder in the Eclipse Project Explorer and then hitting Run (ctrl-F11).

In the Android Device Chooser dialog select your Genymotion device from the Choose a Running Android Device.



#### Run POC on Device
As above, but select your physical device from the Choose a Running Android Device.

