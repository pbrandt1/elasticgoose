# Elasticgoose

It's like mongoose, but for elasticsearch.

(not published to npm yet)

# Usage

```javascript
var elasticgoose = require('../src/elasticgoose');

elasticgoose.connect({
  host: 'localhost:9200',
  log: 'info',
  apiVersion: '2.2'
});

var posts = elasticgoose.Model('test_index', 'post_type', {
  user: String,
  message: String,
  posted: {
    type: Date,
    default: Date.now
  }
})

posts.insert({
  user: 'peter',
  message: 'help me'
}, function(e, r) {
  console.log(r); // ur doc, with the default value all filled in
})

posts.find({user: 'peter'})
  .sort('posted')
  .skip(1)
  .limit(5)
  .select('user posted')
  .exec(function(e, r) {
    console.log(r);
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
the following way in my mocha tests.

```js
var db = yield elasticgoose.createClient();
// do stuff like insert a document
// ...
// call refresh
yield db.client.indicies.refresh();
// now i can immediately search for a document i just inserted
var results = yield model.find({...})
```

# TODO

* update
* insert array of documents
* analyzers in mapping definition
* github.io page

### ISC License

Copyright (c) 2016, Peter Brandt

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
