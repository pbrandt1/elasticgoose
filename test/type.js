var elasticgoose = require('../src/elasticgoose');

elasticgoose.connect({
  host: 'localhost:9200',
  log: 'info',
  apiVersion: '2.2'
});

var posts = elasticgoose.Model('test_index', 'nested_type', {
  user: String,
  message: String,
  obj: {
    type: {
      type: String
    },
    val: String
  },
  posted: {
    type: Date,
    default: Date.now
  }
})

posts.insert({
  user: 'peter',
  message: 'help me',
  obj: {
    type: 'DATA',
    val: '1324354676'
  }
}, function(e, r) {
  console.log(r); // ur doc, with the default value all filled in
})

posts.find({user: 'peter'})
  .sort('posted')
  // .skip(1)
  .limit(5)
  // .select('user posted')
  .exec(function(e, r) {
    console.log(r);
  })
