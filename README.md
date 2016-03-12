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

# TODO

* update
* geolocation
* analyzers in mapping definition

### ISC License

Copyright (c) 2016, Peter Brandt

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
