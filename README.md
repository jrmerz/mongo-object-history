# mongo-object-history

Object history tracking for NodeJS/MongoDB

Tracks objects by type and id.  stores
 - user identifier
 - object identifier
 - timestamp
 - object diff
If the object is new
 - initial object
 - created flag

## Configure

```
var history = require('mongo-object-history');

var collection = mongo.collection('widgets');

var config = {
  get : {
    // you need to define a getter for each type you want to track
    widget : function(id, callback) {
      collection.findOne(id, callback);
    }
  },
  collection : collection
}
history.init(config);
```

## Use
Then to track
```
var history = require('mongo-object-history');

var newWidget = {
  id : '....',
  ....
}
var user = 'foobar-user';

history.track('widget', newWidget, user, function(err, result){
  // object is tracked
  // err is either custom error string or mongodb error
  // result is mongodb response from insert
});
```
