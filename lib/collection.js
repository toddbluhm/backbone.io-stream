
var _ = require('underscore'),
    Backbone = require('backbone'),
    ss = require('socket.io-stream'),
    utils = require('./lib/utils');

module.exports = function(opts) {

  return function (method, model, options) {
    var params = _.extend({}, options);

    if (params.url) {
      params.url = _.result(params, 'url');
    } else {
      params.url = _.result(model, 'url') || utils.UrlError();
    }

    var cmd = params.url.split('/'),
        namespace = (cmd[0] !== '') ? cmd[0] : cmd[1]; // if leading slash, ignore

    if ( !params.data && model ) {
      params.data = params.attrs || model.toJSON(options) || {};
    }

    if (params.patch === true && params.data.id == null && model) {
      params.data.id = model.id;
    }

    // If your socket.io connection exists on a different var, change here:
    var io = model.socket || Backbone.socket || window.socket;

    //since Backbone version 1.0.0 all events are raised in methods 'fetch', 'save', 'remove' etc

    var defer = $.Deferred(),
      stream = ss.createStream({
        encoding: 'utf8',
        decodeStrings: true
      }),
      data = [];
    ss(io).emit(namespace + ':' + method, stream, params.data);

    stream.on('data', function(doc) {
      var parsedDoc = JSON.parse(doc);
      data.push(parsedDoc);
      defer.notify(parsedDoc);
    });

    stream.on('end', function() {
      defer.resolve(data);
      if(options.success) {
        options.success(data);
      }
    });

    stream.on('error', function(err) {
      defer.reject(err);
      if(options.error) {
        options.error(err);
      }
    });

    var promise = defer.promise();
    model.trigger('request', model, promise, options);
    return promise;
  };
};
