var debug = require('debug')('elasticgoose');

var object_to_document = require('./object_to_document')
var results_to_objects = require('./results_to_objects')

//
// Inserts a doc and returns the inserted doc
//
function insert(obj, cb) {
  var ctx = this;
  cb = cb || function() {};
  return new Promise((resolve, reject) => {
    debug('inserting doc for ' + ctx.index + '.' + ctx.type);
    debug('specified object was', obj)
    var doc = object_to_document(obj, ctx.definition);
    debug('doc to insert is', doc);

    ctx.db.client.create({
      index: ctx.index,
      type: ctx.type,
      body: doc
    }, function(e, r) {

      if (e) {
        reject(e);
        return cb(e);
      }

      // the insert operation returned the _id of the new object,
      // so we can get the full object from the db i guess.
      ctx.db.client.get({
        index: ctx.index,
        type: ctx.type,
        id: r._id
      }, function(e, r) {
        if (e) {
          reject(e);
          return cb(e);
        }

        r = results_to_objects(r, ctx.definition)[0];

        cb(null, r);
        resolve(r);
      })
    })
  });
}

module.exports = insert;
