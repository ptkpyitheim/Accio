const express = require('express');
const router = express.Router();

const EmailCode = require('../../models/emailCode').EmailCode;
const User = require('../../models/user').User;

router.get('/', (req, res) => {
  const code = req.query.code;
  if (!code) {
    res.send("no code provided");
    return;
  }

  EmailCode.findOne({ code: code }).then(evc => {
    if (!evc) {
      res.send("incorrect code provided");
      return;
    }

    return User.findById(evc.userId).then(userDoc => {
      if (userDoc == null) {
        res.send('incorrect code (user == null)');
        return;
      }
      userDoc.pendingEmailVerification = false;

      return Promise.all([evc.remove(), userDoc.save()]);
    })

  }).then(v => {
    res.send("Your email has been verified! You may now log in to use Accio!");
  }).catch(err => {
    res.status(500);
    res.send(err.message);
  })


});

module.exports = router;
