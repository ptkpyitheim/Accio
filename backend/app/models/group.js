const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  owner: {
    type: mongoose.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: () => new Date()
  }
});

const EventSchema = new mongoose.Schema({
  host: {
    type: mongoose.ObjectId,
    ref: 'User'
  },
  name: String,
  description: String,
  datetime: Date,
  address: String,
  participants: [{type: mongoose.ObjectId, ref: 'User'}],
});


const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true
  },
  members: {
    type: [{
      type: mongoose.ObjectId,
      ref: 'User'
    }],
    required: true
  },
  liveMembers: [{
    type: mongoose.ObjectId,
    ref: 'User'
  }],
  events: [EventSchema],
  posts: [PostSchema]
});

const Group = mongoose.model('Group', GroupSchema);

module.exports = {
  Group: Group
}
