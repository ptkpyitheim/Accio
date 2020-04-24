const mongoose = require('mongoose');
const User = require('./models/user').User;
const Group = require('./models/group').Group;
const Password = require('./models/password').Password;

const DB_NAME = 'goLive';

mongoose.connect('mongodb://localhost:27017/' + DB_NAME, {useNewUrlParser: true, useUnifiedTopology: true});

const newUser = new User({
  username: "uname1",
  passwordHash: "goodhash"
});

const newGroup = new Group({
  name: "best group",
  description: "best group description"
});


newUser.save();
newGroup.save().then(() => {
  console.log("group added");
});
