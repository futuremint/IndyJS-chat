$(function($){
  var socket = new io.Socket(),
      user = 'anonymous',

  niceTime = function(epoch){
    if (epoch === undefined) return '';
    var d = new Date(epoch);
    return (d.getMonth()+1).toString()+'/'+d.getDate()+' '+d.getHours()+':'+d.getMinutes() }

  // UI stuff
  message = function(msg){
    $('#messages').html( '<p>'+msg+'</p>' );
    setTimeout( function(){$('#messages p').fadeOut('fast')}, 7000 ); },

  showName = function(){
    $('#name').html('You are known as <strong>'+user+'</strong>') },
  
  setName = function(name){
    user = name;
    showName()},

  scrollChatWindow = function(){
    $('#chats div').scrollTop($('#chats div table tr').length * 24) },

  showUserList = function(list){
    var userList = $('#users ul');
    userList.slideUp('fast').children('li').remove();
    _.each( list, function(user){
      userList.append('<li data-id="'+user._id+'">'+user.name+'</li>'); } );
    userList.slideDown('fast'); },

  showChat = function(chat){
    var name = chat.from;
    if (name.length > 10) name = name.slice(0,10);
    $('<tr><td>'+name+'</td><td>'+chat.message+'</td><td>'+niceTime(chat.timestamp)+'</td></tr>').
      hide().
      appendTo('#chats table').
      fadeIn('fast');
      scrollChatWindow() };

  // Socket.IO stuff
  socket.connect();
  socket.on( "connect", function(){ message('Connected.') } )
  socket.on( "message", function(data){
    if ( 'users' in data ) showUserList( data.users );
    if ( 'type' in data && data.type == 'chat' ) showChat( data ); } )
  socket.on( "disconnect", function(){ message('Disconnected!') } ) 

  // Wire up interactivity
  $('#talk').bind('submit', function(e){
    var chat_field = $('#chat-text');
    e.preventDefault();
    socket.send( {chat: chat_field.val(), user: user } );
    chat_field.val('')
  });

  $('#add').bind('submit', function(e){
    var name_field = $('#add-name');
    e.preventDefault();
    socket.send( {addUser: name_field.val()} );
    setName(name_field.val());
    name_field.val('')
  });

  $('#users ul').click(function(e){
    var el = $(e.target);
    setName(el.text())
  });
  showName();
} )