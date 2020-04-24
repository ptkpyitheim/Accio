const mongoose = require("mongoose");

const EmailCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  }
});

const EmailCode = mongoose.model('EmailCode', EmailCodeSchema);

module.exports = {
  EmailCode: EmailCode
}
