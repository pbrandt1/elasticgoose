var elasticgoose = require('../src/elasticgoose');

elasticgoose.connect({
  host: 'localhost:9200',
  log: 'info',
  apiVersion: '2.2'
});

var posts = elasticgoose.Model('test_index', 'geopost', {
  user: String,
  message: String,
  posted: {
    type: Date,
    default: Date.now
  },
  location: {
    type: 'geo_point'
  }
})

// my workplace is at 38°53'47.0"N 77°00'38.1"W
//38.896225, -77.010596
posts.insert({
  user: 'peter',
  message: 'help me',
  location: {
    lon: -77.010596,
    lat: 38.896225
  }
}, function(e, r) {
  console.log(r); // ur doc, with the default value all filled in
})

posts.find({user: 'peter'})
  .sort('posted')
  .skip(1)
  .limit(5)
  .select('user posted location')
  .exec(function(e, r) {
    console.log(r);
  })
