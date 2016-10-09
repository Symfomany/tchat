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
var Message = require('./models/message.js').init(Schema, mongoose)
var User = require('./models/user.js').init(Schema, mongoose)
var address_list = [];
var users = 0;
var passport = require('passport');
var expressSession = require('express-session');



/*
* Initialize services...
*/
app.use(express.static(__dirname));
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());



/**
 * Serializing and Deserializing User Instances
 * Passport also needs to serialize and deserialize user instance 
 * from a session store in order to support login sessions
 */
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



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
   * Signin user with Passeport
   */
  socket.on('signin', function (username, password) {

    passport.use(new LocalStrategy(
      function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (!user.verifyPassword(password)) { return done(null, false); }
          return done(null, user);
        });
      }
    ));
  });




  /**
   * Signup user with Passeport
   */
  socket.on('signup', function (username, password) {

    passport.use('signup', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) {
      findOrCreateUser = function(){
        // find a user in Mongo with provided username
        User.findOne({'username':username},function(err, user) {
          // In case of any error return
          if (err){
            console.log('Error in SignUp: '+err);
            return done(err);
          }
          // already exists
          if (user) {
            console.log('User already exists');
            return done(null, false, 
              req.flash('message','User Already Exists'));
          } else {
            // if there is no user with that email
            // create the user
            var newUser = new User();
            // set the user's local credentials
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.email = req.param('email');
            newUser.firstName = req.param('firstName');
            newUser.lastName = req.param('lastName');
  
            // save the user
            newUser.save(function(err) {
              if (err){
                console.log('Error in Saving user: '+err);  
                throw err;  
              }
              console.log('User Registration succesful');    
              return done(null, newUser);
            });
          }
        });
      };
      
        // Delay the execution of findOrCreateUser and execute 
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
      }));
  });




  /**
   * Handle user connected
   */
  var address = socket.handshake.address; //IP address
     // if in array
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

  //event for numbers...
  socket.emit('count', { count: users });
  socket.broadcast.emit('count', { count: users });


  /*
   * All messages receive
  */
  Message.find({}, function(err, todos) {
    socket.emit('all',todos);
  });


  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
      var message = new Message({
        user: socket.username,
        content: data
      });
       message.save(function(err) {
        if (err) throw err;
        /*socket.emit('added', message ); // person
        socket.broadcast.emit('added', message);*/
        io.emit('added', message );
       });
    
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {numUsers: numUsers});
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