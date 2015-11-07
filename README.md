coevolution
===========


Description
-----------

Node.js web app for conducting experiments looking at the coevolution of language and meaning space. The app can be used on a computer, although it is designed for use on the iPad (other platforms have not been tested). Open the web app in Safari and add it to the home screen for the best experience.


Installation
------------

Install [Node.js](https://nodejs.org) on your server if you don't already have it, e.g.:

```
brew install node
```

Place the contents of this repo in a publicly accessible part of your server and change into the directory, e.g.:

```
cd public_html/coevolution/
```

Install the [express](http://expressjs.com) and [socket.io](http://socket.io) packages at this location using the Node Package Manager (```npm```):

```
npm install express
npm install socket.io
```

This should create a new ```node_modules``` directory containing the directories ```express``` and ```socket.io```.

Modify the ```data_path``` variable in ```server.js``` to provide a path to where you want the results to be stored. Then modify the ```port``` variable in both ```server.js``` and ```client.js``` to some open port number (set to 9000 by default).

Make ```server.js``` executable and not publicly accessible, e.g.:

```
chmod 700 server.js
```

Start the Node.js server:

```
node server.js
```

Navigate to the URL on two iPads and start experimenting!


License
-------

All code in this repository is licensed under the terms of the MIT License.
