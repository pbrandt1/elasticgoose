var debug = require('debug')('elasticgoose')

var exec = require('./exec')
var limit = require('./limit')
var skip = require('./skip')
var select = require('./select')
var sort = require('./sort')

module.exports = function(q) {
  var ctx = this;

  debug('calling find on ' + ctx.index + '.' + ctx.type + ' on host ' + ctx.db.host + ' with query ', q)


  var matches = Object.keys(q).reduce((matches, k) => {
    if (q.hasOwnProperty(k)) {
      var match = {};
      match[k] = q[k];
      matches.push({match: match});
    }
    return matches;
  }, [])

  ctx.body = {
    query: {
      bool: {
        should: matches
      }
    }
  };

  ctx._functions = {
    exec: exec.bind(ctx),
    sort: sort.bind(ctx),
    orderBy: sort.bind(ctx),
    limit: limit.bind(ctx),
    size: limit.bind(ctx),
    skip: skip.bind(ctx),
    select: select.bind(ctx)
  }

  return ctx._functions;
}
