module.exports = function(obj) {
  if (typeof obj === 'string') {
    // first handle "prop1 -prop2" form
    var _sourceInclude = [];
    var _sourceExclude = [];
    obj.replace(/- /g, '-').trim().split(' ').map(function(k) {
      if (k[0] === '-') {
        k.replace(/^-/, '');
        _sourceExclude.push(k);
      } else {
        _sourceInclude.push(k);
      }
    })
    if (_sourceExclude.length > 0) {
      this._sourceExclude = _sourceExclude;
    }
    if (_sourceInclude.length > 0) {
      this._sourceInclude = _sourceInclude;
    }
  } else if (obj instanceof Array) {
    throw new Error('select not implemented for Arrays')
  } else {
    throw new Error('select not implemented for this object type')
  }
  return this._functions;
}
