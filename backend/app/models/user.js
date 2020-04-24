var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  authToken: {
    type: String,
    required: true,
    unique: true
  },
  groups: [{
      type: mongoose.ObjectId,
      ref: 'Group'
  }],
  incomingGroupReq: [{
    user: {
      type: mongoose.ObjectId,
      ref: 'User'
    },
    group:{
      type: mongoose.ObjectId,
      ref: 'Group'
    }
  }],
  outgoingGroupReq: [{
      type: mongoose.ObjectId,
      ref: 'Group'
    }],
  location: {
    latitude: Number,
    longitude: Number
  },
  liveGroup: {
    type: mongoose.ObjectId,
    ref: 'Group'
  },
  friends: {
    friends: [{
      type: mongoose.ObjectId,
      ref: 'User'
    }],
    incomingReq: [{
      type: mongoose.ObjectId,
      ref: 'User'
    }],
    outgoingReq: [{
      type: mongoose.ObjectId,
      ref: 'User'
    }]
  },
  pendingEmailVerification: {
    type: Boolean,
    required: false,
    default: false
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
}
