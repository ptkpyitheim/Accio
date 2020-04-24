const express = require('express');
const router = express.Router();
const jsend = require('../../helpers/jsend');
const User = require('../../models/user').User;


router.post('/', (req, res) => {
    if (!req.body.friendId) {
        jsend.sendFail(res, 400, { message: "Didn't provide a friendId" });
        return;
    }

    // TODO: make sure we are not making duplicate friend request

    req.user.friends.outgoingReq.push(req.body.friendId);

    User.findById(req.body.friendId).then(friend => {
        if (friend == null) {
            jsend.sendFail(res, 400, {
                message: "Invalid friendId"
            });
            return;
        }

        //Check if user is already in incomingRequests
        friend.friends.incomingReq.push(req.user._id);
        Promise.all([req.user.save(), friend.save()]).then(docs => {
            jsend.sendSuccess(res, {});
        }).catch(err => { jsend.sendError(res, err) })
    })

});

module.exports = router;
