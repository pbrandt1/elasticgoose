var json_to_mapping = require('./json_to_mapping')
var object_to_document = require('./object_to_document')
var results_to_objects = require('./results_to_objects')
var query = require('./query')
var debug = require('debug')('eg.model')

module.exports = function(index, type, definition) {
  debug('adding model ' + index + '.' + type)
  var elasticgoose = this;
  var client = elasticgoose.client;
  var mapping = json_to_mapping(definition)

  var model = {
    index: index,
    type: type,
    mapping: mapping,
    definition: definition,

    //
    // so this inserts the document then gets it back out of the database
    //
    insert: function(obj, cb) {
      cb = cb || function() {};
      elasticgoose.worker_queue.push(function(done) {
        debug('inserting doc for ' + index + '.' + type);
        debug(obj)
        var obj2 = object_to_document(obj, definition);
        debug(obj2);
        client.create({
          index: index,
          type: type,
          body: obj2
        }, function(e, r) {
          if (e) { return cb(e) || done(e) }
          client.get({
            index: index,
            type: type,
            id: r._id
          }, function(e, r) {
            done(e);
            r = results_to_objects(r, definition);
            cb(e, r);
          })
        })
      });
    },

    //
    // updates a document and fetches it from the db
    //
    update: function(obj, cb) {
      cb = cb || function() {};
      elasticgoose.worker_queue.push(function(done) {
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
    },

    //
    // gets all the ids and then deletes them in bulk whoooa
    //
    delete: function(q, cb) {
      cb = cb || function() {};
      model.find(q).select('_id').size(10000).exec(function(e, r) {
        if (e || !r || r.length === 0) { return cb(e) }

        var bulk = r.map(function(r) {
          return { delete: { _index: index, _type: type, _id: r._id }}
        });

        elasticgoose.worker_queue.push(function(done) {
          client.bulk({
            body: bulk
          }, function(e, r) {
            done(e);
            cb(e);
          })
        })

      })
    },

    //
    // finds them like you want to
    //
    find: function(q, cb) {
      var ctx = query(q, index, type);
      if (typeof cb === 'function') {
        return ctx._functions.exec(cb);
      }
      return ctx._functions;
    },

    findraw: function(q, cb) {
      var ctx = query(q, index, type);
      ctx.body = q;
      console.log(q);
      console.log(ctx);
      if (typeof cb === 'function') {
        return ctx.functions.exec(cb);
      }
      return ctx._functions;
    }
  };

  // aliases
  model.create = model.insert;
  model.remove = model.delete;
  model.query = model.find;

  //
  // init
  //
  elasticgoose.init_queue.push(function(done) {
    debug('running init for ' + index + '.' + type)

    // the update_mapping function will fail if you change the schema in bad ways i guess
    function update_mapping() {
      debug('updating mapping for ' + index + '.' + type)
      client.indices.putMapping({
        index: index,
        type: type,
        body: {
          properties: mapping
        }
      }, function(e, r) {
        if (e) {
          console.error(e);
          return done(e)
        }
        done();
      })
    }

    // make sure index exists
    client.indices.get({
      index: index
    }, function(e, r) {
      if (!e) {
        return update_mapping();
      }
      client.indices.create({
        index: index
      }, function(e, r) {
        if (e) {
          console.error(e); // note that this will probably always throw an "index already created" error
          done(e);
        }
        done();
      })
    })
  })

  // add the model to the models hash
  if (typeof elasticgoose.models[index] === 'undefined') {
    elasticgoose.models[index] = {};
  }
  elasticgoose.models[index][type] = model;

  return model;
}
