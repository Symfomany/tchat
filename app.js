var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var mongoURI =  process.env.MONGOLAB_URI || 'mongodb://localhost/tchat'
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectID = Schema.ObjectId
var Message = require('./models/message.js').init(Schema, mongoose)
var address_list = [];


var connectWithRetry = function() {
  return mongoose.connect(mongoURI, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};

connectWithRetry();

mongoose.connection.on('open', function() {
  console.log("connected to mongodb");
});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

   var address = socket.handshake.address;
   if (address_list[address]) {
    var socketid = address_list[address].list;
    socketid.push(socket.id);
    address_list[address].list = socketid;
  } else {
    var socketid = [];
    socketid.push(socket.id);
    address_list[address] = [];
    address_list[address].list = socketid;
  }

  users = Object.keys(address_list).length;

  socket.emit('count', { count: users });
  socket.broadcast.emit('count', { count: users });

    /*
    handles 'all' namespace
    function: list all todos
    response: all todos, json format
  */
  Message.find({}, function(err, todos) {
    socket.emit('all',todos);
  });


  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
      var message = new Message({
        userName: socket.username,
        content: data
      });
       message.save(function(err) {
        if (err) throw err;
        socket.emit('added', message );
        socket.broadcast.emit('added', message);
       });
    
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});