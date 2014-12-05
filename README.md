backbone.io-stream
=====================

[![Circle CI](https://circleci.com/gh/toddbluhm/backbone.io-stream.svg?style=shield&circle-token=f92a4ca4bd9b0177059dbf6d77d244edf5c398db)](https://circleci.com/gh/toddbluhm/backbone.io-stream)

A drop-in replacement for Backbones Collection's Sync method that uses socket.io and socket.io-streaming to stream data to the collection from a fetch request.

Performing a fetch will return a jQuery promise that reports progress notifications as each new model is streamed from the server.

Options
-------

- **realtime**<br>
If you pass in the option `realtime: true` to the fetch method, the models will be added to the collection as they are streamed in from the server, otherwise it will wait until streaming has ended before adding the models to the collection.

- **merge**<br>
By default all new models will be merged into the collection, but that can be overridden by passing `merge: false` to the fetch method

**Note:**
If successful, the jQuery promise will return an array of objects that was returned from the server, unless the `realtime` option was set, in which case it will just return true

Tests
----------
**Node Tests**<br>
To run the tests navigate to project directory and type: `grunt test` or `npm test`.

**Browser tests**<br>
To run browser tests, run command `grunt testServer` and that will start a local server. Go to `localhost:8000` and the mocha test page will pop up showing the test results.

While this is certainly not ideal for browser tests, websocket support in headless browsers is greatly lacking currently.

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

Compile Browser Files
----------
To compile the browser files yourself (instead of using the ones in dist), run `npm run-script compile` or `grunt default`.

Examples
--------
A very basic example of the server side can be found in the test/testServer.js file.
A more real world use case would be piping a Mongoosejs QueryStream to the socket.io stream.
