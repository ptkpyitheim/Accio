const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const User = require('../models/user').User;
const jsend = require('../helpers/jsend');


router.post('/', (req, res) => {
  const uname = req.body.username;
  const plaintextPass = req.body.password;

  User.findOne({username: uname}).then(userDoc =>{
    if (userDoc === null) {
      console.log("invalid username provided");
      // is 400 the right http code?
      jsend.sendFail(res, 400, { message: "no user with that username" });
      return;
    }
    else if (userDoc.pendingEmailVerification) {
      jsend.sendFail(res, 400, { message: "the email associated with that user has not been verified" });
      return;
    }

    bcrypt.compare(plaintextPass, userDoc.passwordHash).then(match => {
      if (match) {
        let authToken = "";
        let tokenSavePromise = Promise.resolve({});

        // authToken already exists and is not expired
        if (userDoc.authToken != null) {
          console.log("giving old auth token to " + userDoc.username);
          authToken = userDoc.authToken;
        }
        // generate a new auth token
        else {
          console.log("generating new auth token for " + userDoc.username);
          userDoc.authToken = uuidv4();
          tokenSavePromise = userDoc.save();
        }

        tokenSavePromise.then(userDoc => {
          jsend.sendSuccess(res, {
            token: authToken
          });
        }).catch(err => { jsend.sendError(res, err); });
      }
      else {
        console.log("incorrect password for " + userDoc.username);
        // is 400 the right code?
        jsend.sendFail(res, 400, { message: "invalid password" });
      }
    }).catch(err => {
      jsend.sendError(res, err);
    });
  });
});

module.exports = router;
