const express = require('express');
const router = express.Router();
const User = require('../../models/user').User;

const jsend = require('../../helpers/jsend');


// authentication middleware
router.use("/*", (req, res, next) => {
  const token = req.body.token || req.query.token || req.get("Authorization");
  if (!token) {
    jsend.sendFail(res, 400, { message: "No auth token provided" });
    return;
  }

  User.findOne({ authToken: token }).then(userDoc => {
    if (userDoc === null) {
      jsend.sendFail(res, 403, { message: "Invalid auth token provided" });
      return;
    }
    req.user = userDoc;
    next();
  });
});

router.use('/mygroups', require('./mygroups'));
router.use('/creategroup', require('./creategroup'));
router.use('/joingroup', require('./joingroup'));
router.use('/addgroup', require('./addGroup'));
router.use('/leavegroup', require('./leavegroup'));
router.use('/cancelgroup', require('./cancelGroupReq'));
router.use('/golive', require('./golive'));
router.use('/endlive', require('./endlive'));
router.use('/updatelocation', require('./updatelocation'));
router.use('/createevent', require('./createevent'));
router.use('/createpost', require('./createpost'));
router.use('/me', require('./me'));
router.use('/groupbyid', require('./groupbyid'));
router.use('/addfriend', require('./addFriend'));
router.use('/unfriend', require('./unfriend'));
router.use('/cancelrequest', require('./cancelrequest'));
router.use('/respondtofriendrequest', require('./respondtofriendrequest'));
router.use('/changepassword', require('./changepassword'));
router.use('/addComment', require('./addComment'));
router.use('/getCommentsByPost', require('./getCommentsByPost'));
router.use('/uploadprofilepicture', require('./uploadprofilepicture'));
router.use('/uploadGroupPicture', require('./uploadGroupPicture'));
router.use('/updateMe', require('./updateMe'));
router.use('/joinevent', require('./joinevent'));

module.exports = router;
