function TestServer (server, connect, options) {
  var io = require('socket.io')(server),
      ss = require('socket.io-stream'),
      nodeStream = require('readable-stream'),
      util = require('util'),
      _ = require('underscore');

  var testModels = [{
    _id: 1,
    firstName: 'Test',
    lastName: 'Model',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'+
     'Donec sit amet molestie justo, sed elementum mauris. Integer facilisis'+
     'at elit eu pharetra. Maecenas vehicula eros egestas lorem ultrices, '+
     'vitae auctor enim dictum. Donec scelerisque massa et elementum '+
     'ullamcorper.'
  },
  {
    _id: 2,
    firstName: 'Test2',
    lastName: 'Model2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'+
     'Donec sit amet molestie justo, sed elementum mauris. Integer facilisis'+
     'at elit eu pharetra. Maecenas vehicula eros egestas lorem ultrices, '+
     'vitae auctor enim dictum. Donec scelerisque massa et elementum '+
     'ullamcorper.2222222'
  }];

  io.on('connection', function(socket) {
    ss(socket).on('testModels:read', function(stream, data) {
      if(!data || (data instanceof Array && data.length === 0)) {
        _.each(testModels, function(model) {
          stream.write(JSON.stringify(model));
        });
        stream.end();
      }
    });
  });
}

module.exports = TestServer;
