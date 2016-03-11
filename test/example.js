var elasticgoose = require('../src/elasticgoose');

elasticgoose.connect({
  host: 'localhost:9200',
  log: 'info',
  apiVersion: '2.2'
});

var posts = elasticgoose.Model('test_index', 'post_type', {
  user: String,
  message: String,
  posted: {
    type: Date,
    default: Date.now
  }
})

blips.insert({
  title: 'testing 123',
  description: 'wow what a wonderful test'
}, function(e, r) {
  console.log(r); // ur doc, with the default value all filled in
})

blips.find({title: 'testing'})
  .sort('created')
  .skip(1)
  .limit(5)
  .select('title created')
  .exec(function(e, r) {
    console.log(r);
  })
