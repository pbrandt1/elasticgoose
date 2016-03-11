var elasticsearch = require('elasticsearch')
var Model = require('./model')
var queue = require('queue')
var debug = require('debug')('eg')

// TODO read this stuff
// https://www.elastic.co/blog/changing-mapping-with-zero-downtime

// init the elasticgoose object with a models hash and some worker queues
var elasticgoose = module.exports = {
  models: {},
  init_queue: queue(),
  worker_queue: queue()
};

// model factory
elasticgoose.Model = Model.bind(elasticgoose);

// Connect to an elasticsearch cluster
elasticgoose.connect = function(opts) {
  elasticgoose.client = new elasticsearch.Client(opts);
}

//
// Queues
//

// the init queue must be done one at a time
elasticgoose.init_queue.concurrency = 1;

// the worker queue should only start after the init queue is done
elasticgoose.worker_queue.stop();

// use setTimout to allow other modules to fill the init queue
setTimeout(function() {
  elasticgoose.init_queue.start(function() {
    debug('init queue finished')
    elasticgoose.worker_queue.start();
  })
}, 100)

// logging
elasticgoose.init_queue.on('error', console.error.bind(console))
elasticgoose.worker_queue.on('error', console.error.bind(console))
// elasticgoose.init_queue.on('success', debug)
// elasticgoose.worker_queue.on('success', debug)
