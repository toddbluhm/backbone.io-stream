!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),(o.backbone||(o.backbone={})).ioStream=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _ = require('underscore'),
  Backbone = require('backbone'),
  ss = require('socket.io-stream');

var collectionSync = function CollectionSync (method, model, options) {
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
    stream = ss.createStream({
      encoding: 'utf8',
      decodeStrings: true
    }),
    data = [];

  ss(io).emit(namespace + ':' + method, stream, params.data);

  stream.on('readable', function() {
    var string = stream.read();
    if (string) {
      var parsedDoc = JSON.parse(string);
      if (params.realtime) {
        self.add(parsedDoc, {merge:params.merge || true});
      } else {
        data.push(parsedDoc);
      }
      defer.notify(parsedDoc);
    }
  });

  stream.on('end', function() {
    if(!params.realtime) {
      self.add(data, {merge:params.merge || true});
      defer.resolve(data);
    } else {
      defer.resolve(true);
    }

    if (options.success) {
      options.success(data);
    }
  });

  stream.on('error', function(err) {
    defer.reject(err);
    if (options.error) {
      options.error(err);
    }
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

},{"backbone":"backbone","socket.io-stream":"socket.io-stream","underscore":"underscore"}]},{},[1])(1)
});