
/**************************************** PTK ****************************************/

const express = require('express')
const router = express.Router();
const jsend = require('../../helpers/jsend');
const User = require('../../models/user').User;

router.post('/', (req, res) => {
    if (!req.body.friendId) {
        jsend.sendFail(res, 400, {
            message: "Please specify a user id to unfriend"
        });
        return;
    }

    const outgoingFriendIndex = req.user.friends.outgoingReq.indexOf(req.body.friendId)

    if (outgoingFriendIndex === -1) {
        jsend.sendFail(res, 400, {
            message: "You have not requested the user to be friends yet."
        });
        return;
    }

    User.findById(req.body.friendId).then(friend => {
        //Remove from my outgoing friends list
        const myOutgoingFriends = req.user.friends.outgoingReq
        myOutgoingFriends.splice(myOutgoingFriends.indexOf(req.body.friendId), 1)

        //Remove myself from their incoming friends list
        const theirIncomingFriends = friend.friends.incomingReq;
        theirIncomingFriends.splice(theirIncomingFriends.indexOf(req.user._id), 1)

        return Promise.all([req.user.save(), friend.save()]);
    }).then(v => {
        jsend.sendSuccess(res, {
            message: "You have cancelled the friend request"
        });
    }).catch(err => { jsend.sendError(res, err); });
});

module.exports = router;

/**************************************** PTK ****************************************/

