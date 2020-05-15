const express = require('express');
const router = express.Router();
const jsend = require('../../helpers/jsend');
const User = require('../../models/user').User;
const Group = require('../../models/group').Group;
/**
 * User canceling request to join group
 *  - owner: owner of group (uid)
 *  - user: person who wants to cancel group req (req.user)
 *  - group: group requester wants to cancel req for (gid)
 */
router.post('/', (req, res) => {
    if ( !req.body.uid || !req.body.gid) {
        jsend.sendFail(res, 400, {
        message: "please specify User ID, and Group ID"
        });
        return;
    }
    let user = req.user;

    Group.findById(req.body.gid).then(group => {
        if (group == null) {
            jsend.sendFail(res, 400, {
                message: "Invalid Group ID"
            });
            return;
        }
        User.findById(req.body.uid).then(owner => {
            if (owner == null) {
                jsend.sendFail(res, 400, {
                    message: "Invalid User ID"
                });
                return;
            }
            
            // find requester in owner's incoming group reqs
            var i;
            for(i = 0; i < owner.incomingGroupReq.length; i++){
                if(owner.incomingGroupReq[i].group.equals(req.body.gid)){
                    break;
                }
            }
            
            // find group in requester's outgoing group reqs
            const j = user.outgoingGroupReq.indexOf(req.body.gid);

            if (i === owner.incomingGroupReq.length || j === -1) {
                jsend.sendFail(res, 400, {
                    message: "user did not send join request"
                });
                return;
            }
            
            // remove gid from uid's groups.outgoingReq
            // remove uid from user.groups.incomingReq
            owner.incomingGroupReq.splice(i, 1);
            user.outgoingGroupReq.splice(j, 1);
            

            Promise.all([owner.save(), group.save(), user.save()]).then(docs => {
                jsend.sendSuccess(res, {});
            }).catch(err => { jsend.sendError(res, err) })
        })    
    })

});

module.exports = router;