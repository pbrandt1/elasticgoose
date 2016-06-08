var elasticgoose = require('../src/elasticgoose');
var co = require('co');
var should = require('should');

describe('geolocation', function() {
  it('should create a mapping with geolocation point', function(done) {
    co(function*() {

      // create connection
      var db = yield elasticgoose.createClient();
      db.should.have.properties(['models', 'Model', 'client'])

      // create indices and types
      var posts = yield db.Model('test_index', 'geopost', {
        user: String,
        message: String,
        posted: {
          type: Date,
          default: Date.now
        },
        location: {
          type: 'geo_point'
        }
      });
      // it should also be available on the db object
      should.exist(db.models.test_index.geopost);

    }).then(done, done);
  });

  it('should insert a geolocation point', done => {
    co(function*() {
      // create connection
      var db = yield elasticgoose.createClient();
      db.should.have.properties(['models', 'Model', 'client'])

      // create indices and types
      var posts = yield db.Model('test_index', 'geopost', {
        user: String,
        message: String,
        posted: {
          type: Date,
          default: Date.now
        },
        location: {
          type: 'geo_point'

        }
      });

      // insert some stuff
      // my workplace is at 38°53'47.0"N 77°00'38.1"W
      // 38.896225, -77.010596
      var inserted_post = yield posts.insert({
        user: 'peter',
        message: 'help me',
        location: {
          lon: -77.010596,
          lat: 38.896225
        }
      });


      // the default value should have been populated
      should.exist(inserted_post.posted);

      // some other random location
      //43.303703, -91.426180
      var other_post = yield posts.insert({
        user: 'matt',
        message: 'went for a run today',
        location: {
          lon: -91.426180,
          lat: 43.303703
        }
      });

      // then you can also find it in the db
      var yay_post = yield posts.find({user: 'peter'}).exec();
      should.exist(yay_post);
      console.log(yay_post);

      // also find by id
      yay_post = yield posts.find({_id: inserted_post._id}).exec();
      should.exist(yay_post);

      // also find by geolocation
      var geopost = yield posts.raw({query: {filtered: {filter: {
        geo_distance: {
          distance: '1km',
          location: {
            lon: -77.010596,
            lat: 38.896225
          }
        }}}}})

    }).then(done, done);
  })
})
