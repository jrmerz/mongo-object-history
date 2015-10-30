'use strict';

var diff = require('deep-diff').diff;

var config;
var idParam = 'id';
var trackMongoId = false;

function init(c) {
  config = c;

  if( config.id ) {
    idParam = config.id;
  }
  if( config.trackMongoId ) {
    trackMongoId = true;
  }
}

function track(type, object, user, callback) {
  var id = object[idParam];
  if( !id ) {
    return callback('Object has no id');
  }

  if( !config.get[type] ) {
    return callback(type+' history get handler not defined');
  }

  config.get[type](id, function(err, currentObject){
    if( err ) {
      callback(err);
    }

    var history = {
      id : id,
      user : user,
      datetime : new Date(),
      type : type
    };

    onObjectGet(history, object, currentObject, callback);
  });
}

function onObjectGet(history, newObject, currentObject, callback) {
  if( currentObject === null ) {
    history.created = true;
    history.original = JSON.stringify(newObject);
  } else {
    if( !trackMongoId ) {
      delete currentObject._id;
    }

    var differences = diff(currentObject, newObject);
    if( !differences ) {
      return callback(null, {nochange: true});
    }
    history.diff = JSON.stringify(differences);
  }

  config.collection.insert(history, callback);
}


module.exports = {
  init : init,
  track : track
};
