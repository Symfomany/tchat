/**********************************
*       INSTRUCTIONS MANUAL       *
* This is all the manual you need *
*             RTFM !              *
***********************************/

### Disable CORS
chromium-browser --disable-web-security

### Angular Style Guide
Angular Style Guide By John Papa


/***************
*              *
* BASIC ROUTES *
*              *
****************/

/*
 * Signup route
 */
// SEND
POST: 'http://caty.herokuapp.com/signup'
data: {
	username,
	password,
	password2
}
// RECEIVE
'success' || Object

/*
 * Connect route
 */
// SEND
POST: 'http://caty.herokuapp.com/connect'
data: {
	username,
	password
}
// RECEIVE
'success' || Object

/*
 * Disconnect route
 */
// SEND
GET: 'http://caty.herokuapp.com/disconnect'



/***********************************
*                                  *
* THIS...IS...SOOOOOCKKEEEEETTTTio *
*                                  *
*   Just take a look at socketIo   *
*                                  *
*      http://socket.io/docs/      *
*                                  *
************************************/

// IMPORTANT: version used by server: 1.0.4+

// NOTE: you can connect to 'Public' chatroom
//       without being connected, crazy right ?! :)




/*
 *
 * Client possible inputs (sent by the server)
 *
 */

// connected (as anonymous or registered)
'init'
data: {
	userName: String
}

// inform reconnection
'connect'

// inform disconnection
'disconnect'

// a user left
'user:leave'
data: {
	roomName: String,
	userName: String
}

// username change response
'self:newUsername'
data: userName: String || null

// some user changed his nick
'user:newUsername'
data: {
	userName: String,
	newUsername: String
}

// a user joined a room you're in
'user:join'
data: {
	userName: String,
	roomName: String
}


// someone else sent a message in a room you're in
'send:message'
data: {
	roomName: String,
	userName: String,
	date: ?,
	time: ?,
	message: String
}

// let's play ping-pong :)
'pong'








/*
 *
 * Client accepted outputs (what you may send to the server)
 *
 */

// tell the server you're leaving
'self:leaving'
data: {
	roomName: String
}

// let's play ping-pong :)
'ping'

// ask the server to join a room
// if the room doesn't exist it may be created (needs basic rights)
'self:join'
data: roomName: String

// send your message
'send:message'
data: {
	message: String,
	roomName: String
}

// ask nicely the server to change your nickname
'self:nick'
data: userName: String







/*************
* BONUS ZONE *
*************/

-use compass (scss + mixins + compass mixins + ??) => sass + gulp
-use templates => OKAY
-make a nice interface with the css framework you'd like => animate.css
-use a router (ngRoute or uiRouter)
-implement custom messages (toastr-like)
-implement signup/connection/disconnection interface
-handle multiple rooms
-show users and show if they spoke recently or not
-show beautiful dates and auto-scroll when you speak
-notify the browser if someone spoke
-play sounds !!
-play chess !!
-play go !!
-build an ia to play go !!
-or maybe chess...it'd be a lot easier
