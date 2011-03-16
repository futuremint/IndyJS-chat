var     cradle = require('cradle'),
         creds = require('./creds.js')
  couch_config = {
    host: creds.db_host,
    port: creds.db_port,
    auth: { username: creds.db_name, password: creds.db_pass },
    
            db = new(cradle.Connection)(couch_config).database('node-demo');

// Views
var add_view = function(name, doc){
  db.get('_design/'+name, function(err, rs){
    if(err && err.error == 'not_found') db.save('_design/'+name, doc); } ); };

// Users view
add_view('users', {
  all: {
    map: function(doc) {
      if (doc.type == 'user') emit(null); } },
  auth: {
    map: function(doc) {
      if (doc.type == 'user') emit([doc.email, doc.password]); } } } );

// Chats view
add_view('chats', {
  all: {
    map: function(doc) {
      if (doc.type == 'chat') emit(null); } },
  // map emits keys in from/to pairs so a conversation between two people can be looked up,
  // and reduce reduces the set of all matched documents down to just an array of document ids
  conversation: {
    map: function(doc) {
      if (doc.type == 'chat') emit([doc.from, doc.to], doc._id); }
    // reduce: function(keys, values, rereduce){
    //   var arr = [], id = '';
    //   // Rereduce returns the collapsed set of unique ids from the arrays built below
    //   if(rereduce){
    //     for(var i=0, vlen=values.length; i < vlen; i++){
    //       for(var j=0, klen=values[i].length; j < klen; j++){
    //         id = values[i][j];
    //         if(arr.indexOf(id) == -1) arr.push(id); } }
    //   } else {
    //     for(var i=0, length=keys.length; i < length; i++){
    //       id = keys[i][1]
    //       if(arr.indexOf(id) == -1) arr.push(id); } }
    //   return arr; }
 } } );

module.exports = db;