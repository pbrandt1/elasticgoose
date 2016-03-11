module.exports = function(obj) {
  if (typeof obj === 'string') {
    // first handle "prop1 -prop2" form
    this.sort = obj.replace(/- /g, '-').trim().split(' ').map(function(k) {
      var order = k[0] === '-' ? 'dsc' : 'asc';
      k.replace(/^-/, '');
      return k + ':' + order;
      return sort;
    })
  } else {
    // the object form, which can specify either 'asc'/'dsc' or 1/-1
    this.sort = Object.keys(obj)
      .filter(function(k) { return obj.hasOwnProperty(k) })
      .reduce(function(sort, k) {
        var order = obj[k];
        if (typeof order === 'number') {
          order = order > 0 ? 'asc' : 'dsc';
        }
        sort[k] = {
          order: order
        }
        return sort;
      }, {})
  }
  return this._functions;
}
