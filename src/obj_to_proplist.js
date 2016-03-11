// returns all the properties of an object, which would be an empty set for a string etc
function _props(o) {
  if (typeof o !== 'object' || o instanceof Array) {
    return [];
  }
  return Object.keys(o).filter(function(k) {
    return o.hasOwnProperty(k);
  })
}

// turns a deep object into a list of '.' delimited props
function obj_to_proplist(o) {
  return _props(o).reduce(function(paths, p) {
    var props = obj_to_proplist(o[p]);
    if (props.length === 0) {
      return paths.concat([p]);
    }

    return paths.concat(props.map(function(prop) {
      return p + '.' + prop;
    }))
  }, [])
}

module.exports = obj_to_proplist;
