const express = require('express');
const router = express.Router();
const fs = require('fs');

const EmailCode = require('../../models/emailCode').EmailCode;
const User = require('../../models/user').User;

const htmlText = fs.readFileSync(__dirname + '/../../html/passwordchange.html', { encoding: 'utf8' });

router.get('/', (req, res) => {
  // TODO: get code from request and match in db
  EmailCode.findOne({code: req.query.code}).then(ec => {
    if (ec == null) {
      res.send("link no longer valid");
      return;
    }
    const uid = ec.userId;
    ec.remove();
    return User.findById(uid);
  }).then(userDoc => {
    if (userDoc == null) return;
    const htmlTextToSend = htmlText.replace('${token}', userDoc.authToken);
    res.send(htmlTextToSend);
  }).catch(err => { res.send(err); });



});

module.exports = router;
