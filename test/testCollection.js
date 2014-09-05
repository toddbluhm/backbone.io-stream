//jshint ignore:start
if (typeof window === 'undefined') {
  var jsdom = require('jsdom').jsdom;
  var document = jsdom('<html><head></head><body></body></html>');
  window = document.parentWindow;
  $ = require('jquery');
} else {
  $ = require('jquery')
}

//jshint ignore:end

var Backbone = require('backbone'),
    BackboneIoStream = require('./../backbone.io-stream'),
    io = require('socket.io-client')('http://127.0.0.1:1337'),
    should = require('chai').should();

describe('Collection Streaming', function() {
  var TestModel, TestCollection;
  before(function() {
    TestModel = Backbone.Model.extend({
      urlRoot: 'testModel',
      idAttribute: '_id',
      defaults: {
        description: null,
        firstName: null,
        lastName: null
      },
      socket: io
    });

    TestCollection = Backbone.Collection.extend({
      model: TestModel,
      url: 'testModels',
      sync: BackboneIoStream.collectionSync,
      socket: io
    });
  });

  describe('Collection fetch', function() {
    it('should respond with all returned models', function(done_) {
      var testCollection = new TestCollection();

      testCollection.fetch()
      .then(function(val) {
        val.should.be.Array;
        val.should.have.length(2);
        testCollection.should.have.length(2);
        done_();
      })
      .fail(done_);
    });
    it('should notify promise as data chunk is retrieved', function(done_) {
      var testCollection = new TestCollection();

      var notificationCalls = 0;
      testCollection.fetch()
      .progress(function(deStringifiedData) {
        notificationCalls++;
        deStringifiedData.should.have.property('_id', notificationCalls);
      })
      .fail(done_)
      .done(function() {
        notificationCalls.should.equal(2);
        done_();
      });
    });
    it('should update collection as data is streaming in if realtime option' +
    ' set', function(done_) {
      var testCollection = new TestCollection();

      var modelsAdded = 0;
      testCollection.fetch({realtime:true})
      .fail(done_)
      .done(function() {
        modelsAdded.should.equal(2);
        done_();
      });

      testCollection.on('add', function(newModel) {
        modelsAdded++;
        newModel.should.have.deep.property('attributes._id', modelsAdded);
      });
    });
  });
});
