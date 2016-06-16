# Elasticgoose

It provides mongoose-like schema definitions and a simple query api.

# Usage

```javascript
var elasticgoose = require('elasticgoose');

// create connection
var db = yield elasticgoose.createClient();

// create indices and types
var posts = yield db.Model('example_index', 'post_type', {
  user: String,
  message: String,
  posted: {
    type: Date,
    default: Date.now
  }
});

// insert documents and the default values will be populated
var new_post = yield posts.insert({
  user: 'peter',
  message: 'tbh u r pretty and smart'
});

// use a simple .find() api
var results = yield posts.find({user: 'peter'})
  .sort('posted')
  .skip(1)
  .limit(5)
  .select('user posted')
  .exec();

// or use a custom elasticsearch query
var custom_results = yield posts.query({
  multi_match: {
    query: "pretty and smart",
    type: "best_fields",
    fields: [ "user", "message" ],
    tie_breaker: 0.3,
    minimum_should_match: "30%"
  }
}).exec();
```

# Documentation

#### elasticsearch.createClient([options])
```js
elasticsearch.createClient({
  host: 'some.host:9200', // default is localhost:9200
  log: 'error', // one of (error, warning, info, debug, trace), default is 'info'
  apiVersion: '2.2', // elasticsearch api version, default is '2.2'
})
```


# Learning about Elasticsearch

* https://www.elastic.co/blog/index-vs-type
* https://www.elastic.co/blog/changing-mapping-with-zero-downtime


# Creating your mappings

A couple things to keep in mind when defining your models

* Elasticsearch arrays are unordered, so you will never be able to search on the nth element.
* When using nested objects in your models, you'll be using paths in find like `find({'user.name': 'Crunk'})`. Elasticgoose uses [nested objects](https://www.elastic.co/guide/en/elasticsearch/guide/current/nested-objects.html) when you have an object in your mapping definition.


# Data Availability

Elasticsearch doesn't make inserted data available immediately because
[fsyncs are too slow](https://www.elastic.co/guide/en/elasticsearch/guide/current/near-real-time.html).  Usually that's nbd, but sometimes not.  If you need to make sure all data
is available right now, you can use `db.client.indices.refresh()`.  I use it in
the elasticgoose mocha tests.

### ISC License

Copyright (c) 2016, Peter Brandt

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
