var _ = require('lodash');
var obj_to_proplist = require('./obj_to_proplist')
var debug = require('debug')('elasticgoose');


//
// sets the default values for an object from the mapping
//
module.exports = function(obj, definition) {

  // set default properties
  obj_to_proplist(definition).filter(function(p) {
    return p.match(/\.default$/);
  }).map(function(p) {

    debug('checking default property ' + p)

    // check if a value has already been specified
    if (typeof _.get(obj, p) !== 'undefined') {
      return;
    }

    // if not, use the default value or evaluate the default function
    var default_val = _.get(definition, p);

    if (typeof default_val === 'function') {

      // special case or Date.now
      if (default_val === Date.now) {
        default_val = new Date();
      } else {
        default_val = default_val.bind(obj)();
      }
    }
    _.set(obj, p.replace(/\.default$/, ''), default_val)
  })
  return obj;
}

if (!module.parent) {
  var m = obj_to_proplist(require('./blip_mapping'));
  console.log(m)

  var blip = require('./blip_mapping')
  var c = module.exports({
    title: 'Test blip',
    description: 'wow'
  }, blip)
  console.log(c);
}
