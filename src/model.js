var co = require('co')
var debug = require('debug')('elasticgoose')
var _ = require('lodash')

var definition_to_mapping = require('./definition_to_mapping')
var obj_to_proplist = require('./obj_to_proplist')
var query = require('./query')
var insert = require('./insert')
// var update = require('./update')
var find = require('./find')
var raw = require('./raw')

// TODO read this stuff
// https://www.elastic.co/blog/changing-mapping-with-zero-downtime

module.exports = function(index, type, definition) {
  if (typeof index !== 'string') {
    throw new Error('must specify an index name')
  }

  if (typeof type !== 'string') {
    throw new Error('must specify a type name')
  }

  if (typeof definition !== 'object') {
    throw new Error('must specify a model definition')
  }

  var db = this;

  debug('registering model ' + index + '.' + type + ' to client with host ' + db.host);
  debug('definition is ', definition);
  debug('updating definition with default values');
  obj_to_proplist(definition).map(prop => {
    if (prop.match(/\.(default|type)$/)) return;
    var val = _.get(definition, prop);
    if (typeof val !== 'undefined' && ['String', 'Number', 'Boolean', 'Date'].indexOf(val.constructor.name) >= 0) {
      _.set(definition, prop, {type: val.constructor, default: val})
    }
  })
  debug('definition with default values is', definition);
  var mapping = definition_to_mapping(definition)
  debug('mapping is ', JSON.stringify(mapping, null, 2))


  var model = {
    index: index,
    type: type,
    mapping: mapping,
    definition: definition,

    //
    // so this inserts the document then gets it back out of the database
    //
    insert: insert.bind({
      db: db,
      index: index,
      type: type,
      definition: definition
    }),

    //
    // updates a document and fetches it from the db
    //
    // update: update.bind({
    //   db: db,
    //   index: index,
    //   type: type,
    //   definition: definition
    // }),

    //
    // gets all the ids and then deletes them in bulk whoooa
    //
    // delete: function(q, cb) {
    //   cb = cb || function() {};
    //   model.find(q).select('_id').size(10000).exec(function(e, r) {
    //     if (e || !r || r.length === 0) { return cb(e) }
    //
    //     var bulk = r.map(function(r) {
    //       return { delete: { _index: index, _type: type, _id: r._id }}
    //     });
    //
    //     elasticgoose.worker_queue.push(function(done) {
    //       client.bulk({
    //         body: bulk
    //       }, function(e, r) {
    //         done(e);
    //         cb(e);
    //       })
    //     })
    //
    //   })
    // },

    //
    // finds them like you want to
    //
    find: find.bind({
      db: db,
      index: index,
      type: type,
      definition: definition
    }),

    //
    // build the query body yourself
    //
    query: query.bind({
      db: db,
      index: index,
      type: type,
      definition: definition
    }),

    //
    // make a full raw json request, specifying size etc yourself.
    //
    raw: raw.bind({
      db: db,
      index: index,
      type: type,
      definition: definition
    }),

    //
    // raw: function(q, cb) {
    //   var ctx = query(q, index, type);
    //   ctx.body = q;
    //   console.log(q);
    //   console.log(ctx);
    //   if (typeof cb === 'function') {
    //     return ctx.functions.exec(cb);
    //   }
    //   return ctx._functions;
    // }
  };

  // aliases
  model.create = model.insert;
  model.remove = model.delete;
  model.query = model.query;



  // add the model to the models hash
  if (typeof db.models[index] === 'undefined') {
    db.models[index] = {};
  }
  db.models[index][type] = model;

  //
  // init
  //
  return co(function*() {
    debug('running init for ' + model.index + '.' + model.type)

    // make sure index exists first, we'll do the type next
    try {
      var index = yield db.client.indices.get({ index: model.index });
    } catch (e) {
      debug(e); // not super confident about the elasticsearch api
    }

    if (!index) {
      debug('creating index', model.index);
      try {
        index = yield db.client.indices.create({ index: model.index })
      } catch (e) {
        if (_.get(e, 'body.error.type') === 'index_already_exists_exception') {
          debug('index already exists, moving on');
        } else {
          throw e;
        }
      }
    }

    debug('updating mapping for ' + model.index + '.' + model.type)
    // TODO detect if we need to run a migration
    yield db.client.indices.putMapping({
      index: model.index,
      type: model.type,
      body: {
        properties: model.mapping
      }
    })

    return model;
  })
}
