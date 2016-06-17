var elasticgoose = require('../src/elasticgoose');
var co = require('co');
var should = require('should');

describe('indexes and types', function() {
  beforeEach(function(done) {
    co(function*() {
      var db = yield elasticgoose.createClient();
      var q = yield db.client.indices.delete({ index: '_all' });
    }).then(done, done)
  });
  it('should be able to initialize models in series', (done) => {
    co(function*() {
      var db = yield elasticgoose.createClient();
      var m = yield db.Model('double', 'm', {
        m: String
      });
      var d = yield db.Model('double', 'd', {
        d: String
      });
    }).then(done, done);
  })
  it('should be able to initialize models in parallel', function(done) {
    co(function*() {
      var db = yield elasticgoose.createClient();
      var models = yield {
        m: db.Model('double', 'm', {m: String}),
        d: db.Model('double', 'd', {d: String})
      }
    }).then(done, done);
  })
  it('should be able to initialize the same model more than once', (done) => {
    co(function*() {
      var db = yield elasticgoose.createClient();
      var m = yield db.Model('double', 'm', {
        m: String
      });
      var d = yield db.Model('double', 'm', {
        m: String
      });
    }).then(done, done);
  })
})
