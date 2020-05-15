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

    const friendIndex = req.user.friends.friends.indexOf(req.body.friendId)

    if (friendIndex === -1) {
        jsend.sendFail(res, 400, {
            message: "The user provided is not your friend."
        });
        return;
    }

    User.findById(req.body.friendId).then(friend => {
        //Remove from my friends list
        const myFriends = req.user.friends.friends
        myFriends.splice(myFriends.indexOf(req.body.friendId), 1)

        //Remove myself from their friends list
        const theirFriends = friend.friends.friends;
        theirFriends.splice(theirFriends.indexOf(req.user._id), 1)

        return Promise.all([req.user.save(), friend.save()]);
    }).then(v => {
        jsend.sendSuccess(res, {
            message: "Successfully unfriended"
        });
    }).catch(err => { jsend.sendError(res, err); });
});

module.exports = router;

/**************************************** PTK ****************************************/



