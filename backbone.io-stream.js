var _ = require('underscore'),
  Backbone = require('backbone'),
  ss = require('socket.io-stream'),
  $ = require('jquery'),
  uuid = require('node-uuid');

var collectionSync = function CollectionSync(method, model, options) {
  var params = _.extend({}, options);

  //get the url
  params.url = _.result(params, 'url') ||
    _.result(model, 'url') || urlError();

  // if leading slash, ignore
  var cmd = params.url.split('/'),
    namespace = (cmd[0] !== '') ? cmd[0] : cmd[1];

  if (!params.data && model) {
    params.data = params.attrs || model.toJSON(options) || {};
  }

  if (params.patch === true && params.data.id == null && model) {
    params.data.id = model.id;
  }

  // If your socket.io connection exists on a different var, change here:
  var io = model.socket || Backbone.socket || window.socket;

  //since Backbone version 1.0.0 all events are raised in methods
  //'fetch', 'save', 'remove' etc
  var self = this,
    defer = $.Deferred(),
    data = [],
    _uuid = uuid.v4();

  io.emit(namespace + ':' + method, _uuid, params.data);

  ss(io).on(_uuid, function(stream) {
    stream.on('readable', function() {
      var string = stream.read();
      if (string) {
        var parsedDoc = JSON.parse(string);
        if (params.realtime) {
          self.add(parsedDoc, {
            merge: params.merge || true
          });
        }
        data.push(parsedDoc);
        defer.notify(parsedDoc);
      }
    });

    stream.on('end', function() {
      if (options.success) {
        options.success(data);
      }
      defer.resolve(data);
    });

    stream.on('error', function(err) {
      defer.reject(err);
      if (options.error) {
        options.error(err);
      }
    });
  });

  var prom = defer.promise();
  model.trigger('request', model, prom, options);
  return prom;
};

function urlError() {
  throw new Error('A "url" property or function must be specified');
}

module.exports.collectionSync = collectionSync;
module.exports.overrideExistingSync = function() {
  Backbone.Collection.prototype.sync = collectionSync;
};
