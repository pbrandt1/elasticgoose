var _ = require('lodash')
var debug = require('debug')('eg.exec')
var obj_to_proplist = require('./obj_to_proplist')
var results_to_objects = require('./results_to_objects')

var exec_count = 0;

module.exports = function(cb) {
  cb = cb || function() {};

  // Need the connection
  var elasticgoose = require('./elasticgoose');
  var client = elasticgoose.client;

  // contains all the query information
  var ctx = this;

  // exec is the last thing in the string of commands, so delete .sort() etc
  delete this._functions;

  // only do this when the model is initialized
  elasticgoose.worker_queue.push(function(done) {
    exec_count++
    debug('running exec on ' + ctx.index + '.' + ctx.type + ' (exec count: ' + exec_count + ')')
    debug(JSON.stringify(ctx, null, 2))
    client.search(ctx, function(e, r) {
      // debug('done searching (exec count: ' + exec_count + ')')
      if (e) {
        debug('error with exec count: ' + exec_count)
        debug(e)
        done(e);
        return cb(e);
      }

      // the elasticsearch client brings back dates as strings.
      // use the definition to hack dates
      var definition = elasticgoose.models[ctx.index][ctx.type].definition;
      r = results_to_objects(r, definition);
      
      done();
      cb(null, r);
    })
  });
}
