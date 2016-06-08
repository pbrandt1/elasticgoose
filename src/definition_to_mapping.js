var debug = require('debug')('eg.util');

var not_implemented = "Cannot handle this use case yet (tweet to @odsdq and we'll figure out how to do this the right way)";

//
//
//
var definition_to_mapping = module.exports = function(json, path) {
  // path is a list of property names in deep nested order, mostly good for debugging
  path = path || [];
  if (path && path.length > 0) {
    debug('handling ' + path.join('.'))
  } else {
    debug('handling root')
  }

  // undefined
  if (typeof json === 'undefined' || !json) {
    debug(json)
    throw new Error(not_implemented);
  }

  // [...]
  if (json instanceof Array) {
    // []
    if (json.length === 0) {
      debug(json)
      throw new Error(not_implemented);
    } else if (json.length === 1) {
      return definition_to_mapping(json[0], path)
    }
  }

  // String
  if (json === String) {
    return { type: 'string' }
  }

  if (typeof json === 'string') {
    return {
      type: 'string',
      null_value: json
    }
  }

  // Date
  if (json === Date) {
    return { type: 'date' }
  }

  if (json instanceof Date) {
    return {
      type: 'date',
      null_value: json
    }
  }

  // Number
  if (json === Number) {
    return { type: 'float' }
  }

  if (typeof json === 'number') {
    return {
      type: 'float',
      null_value: json
    }
  }

  // Boolean
  if (json === Boolean) {
    return { type: 'boolean' }
  }

  if (typeof json === 'boolean') {
    return {
      type: 'boolean',
      null_value: json
    }
  }

  // Custom mapping
  if (typeof json === 'string') {
    return { type: json }
  }

  // Object (unmapped nested property?)
  if (json === Object) {
    throw new Error(not_implemented)
  }

  // Should have handled everything except for:
  //  * property definitions
  //  * mapped nested objects
  if (typeof json !== 'object') {
    throw new Error(not_implemented)
  }

  var props = Object.keys(json).filter(function(k) {
    return json.hasOwnProperty(k)
  });

  debug(props);

  // { type: String, default: "blah" }
  if (props.indexOf('type') >= 0 && !json.type.type) {

    debug('property definition object (like {type: String})')

    var definition = definition_to_mapping(json.type, path.concat(['type']));

    if (typeof json.type === 'string') {
      debug('detected custom mapping', json.type);
      definition.type = json.type;
    }

    if (props.indexOf('default') >= 0 && typeof json.default !== 'function') {
      definition.null_value = json.default;
    }

    if (typeof json.indexed === 'boolean') {
      definition.index = json.indexed ? 'analyzed' : 'not_analyzed';
    }

    return definition;
  }

  var obj = props.reduce(function(o, k) {
    o[k] = definition_to_mapping(json[k], path.concat([k]));
    return o;
  }, {})

  if (path.length === 0) {
    return obj;
  } else {
    return {
      type: 'nested',
      include_in_parent: true,
      properties: obj
    }
  }

}


if (!module.parent) {
  var m = definition_to_mapping({
    str: String,
    num: Number,
    bool: Boolean,
    date: Date,
    strx: [String],
    numx: [Number],
    boolx: [Boolean],
    datex: [Date],
    obj: {
      str: String
    }
  });
  console.log(m)
}
