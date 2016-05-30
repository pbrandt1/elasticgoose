var _ = require('lodash')
var co = require('co')
var debug = require('debug')('eg.exec')

var obj_to_proplist = require('./obj_to_proplist')
var results_to_objects = require('./results_to_objects')

module.exports = function() {
  var ctx = this;

  debug('running exec on ' + ctx.index + '.' + ctx.type + ' on host ' + ctx.db.host)
  debug(JSON.stringify(ctx.body, null, 2));
  return co(function*() {
    var results = yield ctx.db.client.search({
      index: ctx.index,
      type: ctx.type,
      body: ctx.body
    });

    return results_to_objects(results, ctx.definition);
  });
}
