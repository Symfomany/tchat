app = require('express.io')()
var mongoose = require('mongoose');

app.http().io()


/**
 * Build Model
 */
function getMessageModel(){
    var  messageSchema = new mongoose.Schema({
        userName : { type : String },
        content : { type : String },
        date : { type : Date, default : Date.now }
    });

    return mongoose.model('messages');
}


/**
 * Get All Commentaires
 */
/*
app.io.route('ready', function(req) {
     req.io.emit('talk', {
        message: 'io event from an io route on the server'
        })


    mongoose.connect('mongodb://localhost/tchat', function(err) {
        if (err) { throw err; }

        var messageModel = getMessageModel();

        messageModel.find(null, function (err, messages) {
            if (err) { throw err; }
            res.send(messages);
        });

    });
});
*/

app.get('/messages', function(req,res){
    var db = mongoose.connection;

    mongoose.connect('mongodb://localhost/tchat', function(err) {
    if (err) { throw err; }

    var messageModel = getMessageModel();

    messageModel.find(null, function (err, messages) {
        if (err) { throw err; }
        res.send(messages);
    });
    
    mongoose.disconnect() 


    });
})


app.listen(7076)