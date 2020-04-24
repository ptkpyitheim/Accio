const express = require('express');
const router = express.Router();
const jsend = require('../../helpers/jsend');
const User = require('../../models/user').User;
const Group = require('../../models/group').Group;

// uid: user id, gid: group id
router.post('/', (req, res) => {
    if (!req.body.uid) {
        jsend.sendFail(res, 400, { message: "Didn't provide Owner ID" });
        return;
    }else if(!req.body.gid){
        jsend.sendFail(res, 400, { message: "Didn't provide Group ID" });
        return;
    }

    
    User.findById(req.body.uid).then(owner => {
        if (owner == null) {
            jsend.sendFail(res, 400, {
                message: "Invalid User ID"
            });
            return;
        }
        
        // add user to owner's incoming list
        // add gid to their outgoing list
        owner.incomingGroupReq.push({user: req.user._id, group: req.body.gid});
        req.user.outgoingGroupReq.push(req.body.gid);

        Promise.all([req.user.save(), owner.save()]).then(docs => {
            jsend.sendSuccess(res, {});
        }).catch(err => { jsend.sendError(res, err) });
    })    

});

module.exports = router;