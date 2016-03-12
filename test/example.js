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

posts.insert({
  user: 'peter',
  message: 'help me'
}, function(e, r) {
  console.log(r); // ur doc, with the default value all filled in
})

posts.find({user: 'peter'})
  .sort('posted')
  .skip(1)
  .limit(5)
  .select('user posted')
  .exec(function(e, r) {
    console.log(r);
  })
