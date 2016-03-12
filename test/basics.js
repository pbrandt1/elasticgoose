var elasticgoose = require('../src/elasticgoose')

elasticgoose.connect({
  host: 'localhost:9200',
  log: 'info',
  apiVersion: '2.2'
})

var blips = elasticgoose.Model('elasticgoose', 'blip', require('./blip_mapping'))

elasticgoose.worker_queue.concurrency = 1;

blips.insert({
  title: 'testing 123',
  description: 'wow what a wonderful test'
}, function(e, r) {
  console.log(e); // undefined
  console.log(r); // ur doc, with the default value all filled in
})

blips.delete({title: 'testing'}, function(e, r) {
  console.log('err, res from delete:')
  console.log(e)
  console.log(r);
})


blips.find({title: 'testing'})
  .sort('created')
  .skip(1)
  .limit(5)
  .select('_id')
  .exec(function(e, r) {
    if (e) {
      console.error(e);
    }
    console.log(r);
  })
