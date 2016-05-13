var elasticsearch = require('elasticsearch')
var Model = require('./model')
var debug = require('debug')('elasticgoose')
var co = require('co');
var _ = require('lodash');

var default_options = {
  host: 'localhost:9200',
  log: 'info',
  apiVersion: '2.2'
};

// init the elasticgoose object and test connection
function createClient (options) {
  options = _.merge({}, default_options, options);
  debug('setting up elasticsearch client with options', options);

  return new Promise(function(resolve, reject) {
    var db = {
      client: new elasticsearch.Client(options),
      models: {},
      Model: Model,
      host: options.host
    };

    db.client.ping({}, function (error) {
      if (error) {
        debug('ping failed for client pointing to ' + options.host)
        reject(error);
      } else {
        resolve(db);
      }
    });
  })
}

//
// //
// // Queues
// //
//
// // the init queue must be done one at a time
// elasticgoose.init_queue.concurrency = 1;
//
// // the worker queue should only start after the init queue is done
// elasticgoose.worker_queue.stop();
//
// // use setTimout to allow other modules to fill the init queue
// setTimeout(function() {
//   elasticgoose.init_queue.start(function() {
//     debug('init queue finished')
//     elasticgoose.worker_queue.start();
//   })
// }, 100)

// logging
// elasticgoose.init_queue.on('error', console.error.bind(console))
// elasticgoose.worker_queue.on('error', console.error.bind(console))
// elasticgoose.init_queue.on('success', debug)
// elasticgoose.worker_queue.on('success', debug)


module.exports.createClient = createClient;
