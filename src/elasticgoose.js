var elasticsearch = require('elasticsearch')
var Model = require('./model')
var debug = require('debug')('elasticgoose')
var co = require('co');
var _ = require('lodash');

var default_options = {
  host: 'localhost:9200',
  log: 'info',
  apiVersion: '2.2'
};

// init the elasticgoose object and test connection
function createClient (options) {
  options = _.merge({}, default_options, options);
  debug('setting up elasticsearch client with options', options);

  return new Promise(function(resolve, reject) {
    var db = {
      client: new elasticsearch.Client(options),
      models: {},
      Model: Model,
      model: Model,
      host: options.host
    };

    db.client.ping({}, function (error) {
      if (error) {
        debug('ping failed for client pointing to ' + options.host)
        reject(error);
      } else {
        resolve(db);
      }
    });
  })
}

module.exports.createClient = createClient;
