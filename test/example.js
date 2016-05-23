var elasticgoose = require('../src/elasticgoose');
var co = require('co');
var should = require('should');

describe('a basic example', function() {
  it('should totally work like in like the most simple cases', function(done) {
    co(function*() {

      // create connection
      var db = yield elasticgoose.createClient();
      db.should.have.properties(['models', 'Model', 'client'])

      // create indices and types
      var posts = yield db.Model('example_index', 'posts', {
        user: String,
        message: String,
        posted: {
          type: Date,
          default: Date.now
        }
      });

      // it should also be available on the db object
      should.exist(db.models.example_index.posts);

      // insert some stuff
      var inserted_post = yield posts.insert({
        user: 'peter',
        message: 'help me'
      });

      // the default value should have been populated
      should.exist(inserted_post.posted);

      // then you can also find it in the db
      var yay_post = yield posts.find({user: 'peter'}).exec();
      should.exist(yay_post);
      console.log(yay_post);

    }).then(done, done);
  })
})
