'use strict';

// The model!
function init(Schema, mongoose) {
  var MessageSchema = new Schema({
    content: { type : String, default : '', trim : true },
    userName: { type : String, default : 'Anonyme', trim : true },
    createdAt  : { type : Date, default : Date.now }

  });

  /**
 * Validations
 */

MessageSchema.path('content').required(true, 'Content cannot be blank');
MessageSchema.path('userName').required(true, 'User cannot be blank');


  return mongoose.model('Message', MessageSchema);
}

module.exports.init = init;