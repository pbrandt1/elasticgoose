var co = require('co');

var object_to_document = require('./object_to_document');

function update(obj) {
  var ctx = this;
  debug('updating doc for ' + ctx.index + '.' + ctx.type + ' on host ' + ctx.db.host);
  debug('specified object was', obj)
  var doc = object_to_document(obj, ctx.definition);
  debug('doc to update is', doc);

    debug('inserting doc for ' + index + '.' + type);
    debug(obj)
    var obj2 = object_to_document(obj, definition);
    debug(obj2);
    client.update({
      index: index,
      type: type,
      body: obj2
    }, function(e) {
      done(e);
      cb(e);
    })
  });
}

module.exports = update;
