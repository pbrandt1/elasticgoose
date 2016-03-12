var debug = require('debug')('eg.util')
var obj_to_proplist = require('./obj_to_proplist')
var _ = require('lodash')

module.exports = function(results, definition) {

  // elasticsearch returns dates as strings, i want dates
  // this gets a list of date props
  var date_props = obj_to_proplist(definition).filter(function(p) {
    return _.get(definition, p) === Date;
  }).map(function(p) {
    return p.replace(/\.type$/, '')
  })

  if (_.get(results, 'hits.hits')) {
    var objects = results.hits.hits;
    var isArray = true;
  } else {
    objects = results;
  }

  objects = [].concat(objects).map(function(h) {
    // put the _id on the source object
    h._source._id = h._id;

    // replace all the date strings with real dates
    date_props.map(function(p) {
      if (_.get(h._source, p)) {
        _.set(h._source, p, new Date(_.get(h._source, p)));
      }
    })
    return h._source;
  })

  if (!isArray) {
    objects = objects[0];
  }
  return objects;
}
