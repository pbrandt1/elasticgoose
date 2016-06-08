var elasticgoose = require('../src/elasticgoose');
var co = require('co');
var should = require('should');



describe('mappings', function() {
  beforeEach(function(done) {
    co(function*() {
      var db = yield elasticgoose.createClient();
      var q = yield db.client.indices.delete({ index: '_all' });
    }).then(done, done)
  });

  it('should allow you to use simple javascript types', function(done) {
    co(function*() {
      var db = yield elasticgoose.createClient();

      var model = yield db.Model('elasticgoose', 'simple', {
        str: String,
        num: Number,
        bool: Boolean,
        date: Date
      });

      var date = new Date();

      var doc = yield model.insert({
        str: 'apollo',
        num: 18,
        bool: false,
        date: date
      });
      should.exist(doc);
      yield db.client.indices.refresh();
      var x = yield model.find({
        str: 'apollo',
        num: 18,
        bool: false,
        date: date
      }).exec();

      x[0].should.have.properties({
        str: 'apollo',
        num: 18,
        bool: false,
        date: date
      });

      x[0].should.have.property('_id');
      x[0]._id.should.have.type('string');
    }).then(done, done)
  });

  it('should allow you to create a mapping with object types', function(done) {
    co(function*() {
      var db = yield elasticgoose.createClient();
      var model = yield db.Model('elasticgoose', 'obj', {
        obj: {
          str: String,
          num: Number,
          bool: Boolean,
          date: Date
        }
      })
      var date = new Date();
      var doc = yield model.insert({
        obj: {
          str: 'apollo',
          num: 18,
          bool: false,
          date: date
        }
      });
      yield db.client.indices.refresh();
      var x = yield model.find({
        'obj.str': 'apollo',
        'obj.num': 18,
        'obj.bool': false,
        'obj.date': date
      }).exec();

      x[0].should.have.property('obj');
      x[0].obj.should.have.properties({
        str: 'apollo',
        num: 18,
        bool: false,
        date: date
      })

    }).then(done, done);
  });

  it('should allow you to create a mapping with array types', function(done) {
    co(function*() {
      var db = yield elasticgoose.createClient();
      var model = yield db.Model('elasticgoose', 'arr', {
        str: [String],
        num: [Number],
        bool: [Boolean],
        date: [Date]
      });
      var date = new Date();
      var doc = yield model.insert({
        str: ['mercury', 'gemini', 'apollo'],
        num: [1, 2, 3],
        bool: [true, false],
        date: [date, new Date()]
      });
      yield db.client.indices.refresh();
      var x = yield model.find({
        str: 'apollo',
        num: 3,
        bool: true,
        date: date
      }).exec();
      x[0].str.should.be.an.Array();
      x[0].num.should.be.an.Array();
      x[0].bool.should.be.an.Array();
      x[0].date.should.be.an.Array();
    }).then(done, done);
  });

  it('should allow you to use default values', function(done) {
    co(function*() {
      var db = yield elasticgoose.createClient();
      var date = new Date();
      var model = yield db.Model('elasticgoose', 'def_value_models', {
        str: 'Default String',
        num: {
          type: Number,
          default: 12
        },
        bool: true,
        date: date
      });
      var doc = yield model.insert({});
      console.log(doc);
      yield db.client.indices.refresh();
      var x = yield model.find({
        str: 'Default String',
        num: 12,
        bool: true,
        date: date
      }).exec();
      console.log(x)
      x[0].should.have.properties({
        str: 'Default String',
        num: 12,
        bool: true,
        date: date
      })
    }).then(done, done);
  })
})
