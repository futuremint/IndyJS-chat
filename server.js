var version = '0.0.5',
    http = require('http'), 
      io = require('socket.io'),
      db = require('./db'),
 express = require('express'),
     app = express.createServer();

// Express config
app.configure( function(){
  app.use( express['static']( __dirname+"/public" ) );
  app.use( express.bodyParser() );
  app.use( express.logger( {format: ':method :url :response-timems'} ) );
  app.use( app.router ); } );

app.configure( 'development', function(){
  app.use( express.errorHandler( {dumpExceptions: true, showStack: true } ) ); } );

app.configure( 'production', function(){
  app.use( express.errorHandler() ); } );

/* Express is a Sinatra 'clone', here is how you'd handle a route
 * app.get('/something', function(res, req){
 *   res.send('Not giving you that for nothing!');
 * })
 */

// Start Express
app.listen(8911);

// Socket.IO
var socket = io.listen(app);
socket.on( 'connection', function(client){
  // Retrieve the user list from CouchDB and send it to the client
  db.view( 'users/all', {include_docs: true}, function(err, rows){
    var list = [];
    if (rows) rows.forEach( function(row){ list.push( row ); } );
    client.send( {users: list} );

    // Send a few latest chats to the client
    db.view( 'chats/all', {include_docs: true}, function(err, rows){
      if (rows) rows.forEach( function(row){ client.send( row ); } ); } ); } );

  client.on( 'message', function(data){ 
    
    if ('chat' in data) {
      var chat = {type: 'chat', message: data.chat, from: data.user, timestamp: Date.now()};
      db.post(chat, function(err, res){
        client.send( chat );
        client.broadcast( chat ); } ); }

    if ('addUser' in data) {
      var user = {type: 'user', name: data.addUser, status: 'online'};
      db.post(user, function(err, res){
        db.view( 'users/all', {include_docs: true}, function(err, rows){
          var list = [];
          if (rows) rows.forEach( function(row){ list.push( row ); } );
          client.send( {users: list} );
          // Also update everyone else's user lists
          client.broadcast( {users: list} ); } ); } ); } } );

  client.on( 'disconnect', function(){ console.log('disconnect!'); } ); } );
