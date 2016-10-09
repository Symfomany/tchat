'use strict';

// The model!
function init(Schema, mongoose) {
  var UserSchema = new Schema({
    userName: { type : String, default : 'Anonyme', trim : true },
    password: { type : String,  trim : true },
    createdAt  : { type : Date, default : Date.now }

  });


/**
 * Validations
 */

UserSchema.path('userName').required(true, 'Userename cannot be blank');
UserSchema.path('password').required(true, 'Password cannot be blank');


  return mongoose.model('User', UserSchema);
}

module.exports.init = init;