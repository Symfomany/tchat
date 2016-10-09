/**
 *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * 
 *
 *  Tchat with Express + Mongo
 *  Handle users, tchat, rooms etc ...
 * 
 *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * 
 */




var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var mongoURI =  process.env.MONGOLAB_URI || 'mongodb://localhost/tchat'
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectID = Schema.ObjectId
var passwordHash = require('password-hash');

// Load Models...
var Message = require('./models/message.js').init(Schema, mongoose)
var User = require('./models/user.js').init(Schema, mongoose)



/*
* Initialize services of sessions : logging, parsing, and session handling....
*/
app.use(express.static(__dirname));




/*
* Initialize variables...
*/
var address_list = [];
var users = 0;


/**
 * Express launching web server on port 3000
 */
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});



/**
 * Connexion in MongoDb with Mongoose 
 */
var connectWithRetry = function() {
  return mongoose.connect(mongoURI, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};


/**
 * Connect on database start...
 */
mongoose.connection.on('open', function() {
  console.log("connected to mongodb...");
});




connectWithRetry();



// Chatroom

var numUsers = 0;


/**
 * When a client connect on port socket.io...
 */
io.on('connection', function (socket) {
   var addedUser = false;



  /**
   * Handle user connected
   */
  var address = socket.handshake.address; //IP address
     // if in array...
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




  /**
   * Signin user with Passeport
   */
  socket.on('signin', function (data) {
      User.findOne({ username: data.username }, function (err, user) {
        if (err) { return socket.emit('signin:error', {message: err}) }
        if (!user) { return socket.emit('signin:error', {message: "Mauvais username/mot de passe"}) }
        if (!passwordHash.verify(data.password, user.password)) { return socket.emit('signin:error', {message: "Mauvais mot de passe..."})  }
        return socket.emit('signin:success',  user)
      });
  });




  /**
   * Signup user with Passeport
   */
  socket.on('signup', function (data) {
       User.findOne({ username : data.username},function(err,user){
          if(err) { return socket.emit('signup:error', {message: err}) }
          if(user){ return socket.emit('signup:error', {message: 'Utilisateur existe déjà...'}) }
          else{
            var newUser = new User();
            newUser.username = data.username;
            newUser.password =  passwordHash.generate(data.password);
            newUser.save(function(err) { //save
              if (err){ return socket.emit('signup:error', {message: err})}
                return socket.emit('signup:success', newUser)
            });
          }

      });
  });


  /**
   * All messages 
   */
  socket.on('messages:receive', function (data) {
   /*
    * All messages receive
    */
    Message.find({}, function(err, todos) {
      socket.emit('messages:all',todos);
    });

  });

  /**
   * All messages 
   */
  socket.on('messages:send', function (data) {
   /*
    * Create a message
    */
   var message = new Message({
        userName: data.username,
        content: data.message
    });

    message.save(function(err) {
        if (err) socket.emit('messages:error', err) ;
        socket.broadcast.emit('messages:success', message);
    });
  });


  //event for numbers...
  io.emit('count', { count: users });

 

  // when the client emits 'add user', this listens and executes
  socket.on('user:add', function (username) {
    if (addedUser) return;
    socket.username = username;
    ++numUsers;
    addedUser = true;

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user:joined', {
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
  socket.on('typing:stop', function () {
    socket.broadcast.emit('typing:stop', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

    io.emit('count', { count: numUsers });

      // echo globally that this client has left
      socket.broadcast.emit('user:left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});