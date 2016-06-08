var debug = require('debug')('elasticgoose')
var obj_to_proplist = require('./obj_to_proplist')
var _ = require('lodash')

module.exports = function(results, definition) {

  // elasticsearch returns dates as strings, i want javascript date objects
  // this gets a list of date props
  var date_props = obj_to_proplist(definition).filter(function(p) {
    return _.get(definition, p) === Date;
  }).map(function(p) {
    return p.replace(/\.type$/, '')
  })

  // um sometimes this function is called on an array, and sometimes just a single object
  if (_.get(results, 'hits.hits')) {
    var objects = results.hits.hits;
  } else {
    objects = [results];
  }

  objects = objects.map(function(h) {
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

  return objects;
}
