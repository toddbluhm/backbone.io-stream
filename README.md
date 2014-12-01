backbone.io-stream
=====================

A drop-in replacement for Backbones Collection's Sync method that uses socket.io and socket.io-streaming to stream data to the collection from a fetch request.

Performing a fetch will return a jQuery promise that reports progress notifications as each new model is streamed from the server.

Options
-------

- realtime
If you pass in the option "realtime: true" to the fetch method, the models will be added to the collection as they are streamed in from the server, otherwise it will wait until streaming has ended before adding the models to the collection.

- merge
By default all new models will be merged into the collection, but that can be overridden by passing "merge: false" to the fetch method

**Note:**
If successful, the jQuery promise will return an array of objects that was returned from the server, unless the "realtime" option was set, in which case it will just return true

Tests
----------
To run the tests navigate to project directory and type: "grunt" or "npm test"
That will compile and run the test cases

Versions
-------------

There are two versions in the browser/dist folder.
- "Standalone" version contains all the source files and dependencies necessary.
- "Require" contains just the backbone.io-stream code and expects you to take care of having the dependencies available when used.

Dependencies
------------
- Underscore
- jQuery
- Backbone
- Socket.io-stream
- Socket.io/Socket.io-client.

Examples
--------
A very basic example of the server side can be found in the test/testServer.js file. 
A more real world use case would be piping a Mongoosejs QueryStream to the socket.io stream.

Notes
-----
- Currently phantomjs test cases fail as phantomjs does not fully implement the latest websocket standard.
