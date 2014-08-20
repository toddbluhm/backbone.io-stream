
var backbone = require('backbone'),
    socketio = require('socket.io'),
    ss = require('socket.io-stream'),
    model = require('./lib/model'),
    collection = require('./lib/collection');

module.exports.modelSync = model;
module.exports.collectionSync = collection;
module.exports.overrideExistingSync = function () {
  backbone.Model.prototype.sync = model;
  backbone.Collection.prototype.sync = collection;
};
