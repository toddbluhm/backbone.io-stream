var should = require('should');

describe('Model Streaming', function(){

  before(function(done) {
    var app = require('http').createServer(),
        io = require('socket.io')(app),
        ss = require('socket.io-stream'),
        stream = require('stream');

    app.listen(80);

    var testModel1 = {
      _id: '1',
      firstName: 'Test',
      lastName: 'Model',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet molestie justo, sed elementum mauris. Integer facilisis at elit eu pharetra. Maecenas vehicula eros egestas lorem ultrices, vitae auctor enim dictum. Donec scelerisque massa et elementum ullamcorper.'
    };

    var testModel2;

    io.on('connection', function(socket) {
      ss(socket).on('testModel:read', function(stream, data, callback) {
        var rs = new stream.Readable();
        rs._read = function() {
          rs.push(JSON.stringify(testModel1));
          rs.push(null);
        };
        rs.pipe(stream);
      });

      ss(socket).on('testModel:create', function(stream, data, callback) {
        var ws = new stream.Writeable({enc: 'utf8', decodeStrings: false});
        ws._write = function(chunk, enc, next) {
          testModel2 = JSON.parse(chunk);
          next();
        };
        stream.pipe(ws);

        var rs = new stream.Readable();
        rs._read = function() {
          rs.push(JSON.stringify(testModel2));
          rs.push(null);
        };

        ws.on('finish', function() {
          stream.unpipe(ws);
          testModel2.should.be.an.Object;
          testModel2._id = '2'; //update the model and give it an id
          rs.pipe(stream);
        });
      });
    });
  });

  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});
