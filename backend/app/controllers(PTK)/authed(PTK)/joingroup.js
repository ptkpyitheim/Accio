const express = require('express');
const router = express.Router();
const jsend = require('../../helpers/jsend');
const User = require('../../models/user').User;
const Group = require('../../models/group').Group;
/**
 * Owner of group responding to request to join group
 *  - owner: owner of group (req.user)
 *  - requester: person who wants to join group (uid)
 *  - group: group requester wants to join (gid)
 */
router.post('/', (req, res) => {
    if (req.body.accept == null || !req.body.uid || !req.body.gid) {
        console.log("not everything set");
        jsend.sendFail(res, 400, {
            message: "please specify accept (true/false), User ID, and Group ID"
        });
        return;
    }
    let owner = req.user;
    console.log("owner set");
    Group.findById(req.body.gid).then(group => {
        if (group == null) {
            console.log("invalid group id");
            jsend.sendFail(res, 400, {
                message: "Invalid Group ID"
            });
            return;
        }
        console.log("group set");
        User.findById(req.body.uid).then(requester => {
            if (requester == null) {
                console.log("invalid user id");
                jsend.sendFail(res, 400, {
                    message: "Invalid User ID"
                });
                return;
            }
            console.log("requester set");

           
            // find requester in owner's incoming group reqs
            var i;
            for(i = 0; i < owner.incomingGroupReq.length; i++){
                if(owner.incomingGroupReq[i].group.equals(req.body.gid)){
                    break;
                }
            }

             // find group in requester's outgoing group reqs
            const j = requester.outgoingGroupReq.indexOf(req.body.gid);
            if (i === owner.incomingGroupReq.length || j === -1) {
                jsend.sendFail(res, 400, {
                    message: "user did not send join request"
                });
                return;
            }

            if (req.body.accept) {
                // remove gid from uid's groups.outgoingReq
                // remove uid from user.groups.incomingReq
                owner.incomingGroupReq.splice(i, 1);
                requester.outgoingGroupReq.splice(j, 1);
                //Check if user is already in group
                group.members.push(req.body.uid)
                requester.groups.push(req.body.gid);
            }
            

            Promise.all([owner.save(), group.save(), requester.save()]).then(docs => {
                jsend.sendSuccess(res, {});
            }).catch(err => { jsend.sendError(res, err) });
        }).catch(err => { jsend.sendError(res, err) });
    }).catch(err => { jsend.sendError(res, err) });

});

module.exports = router;