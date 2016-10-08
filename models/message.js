// The model!
function init(Schema, mongoose) {
  var TheSchema = new Schema({
    content: String,
    userName: Boolean
  });

  return mongoose.model('Message', TheSchema);
}

module.exports.init = init;