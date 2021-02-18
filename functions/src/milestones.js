const functions = require("firebase-functions");
const admin = require('firebase-admin');

module.exports = {
    postMilestone : async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            await db.collection('milestones').doc('/' + body.id + '/')
                .create({
                    userpostId: body.userpostId,
                    userid: body.userid,
                    heading: body.heading,
                    text: body.text
                });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    getMilestone: async (req, res, db) => {
        try {
            const document = db.collection('milestones');
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    editMilestone: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            const document = db.collection('milestones').doc(req.params.milestone_id);
            await document.update({
                id: body.id,
                userpostId: body.userpostId,
                userid: body.userid,
                text: body.text,
                reactions: body.reactions,
                replies: body.replies
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    deleteMilestone: async (req, res, db) => {
        try {
            const document = db.collection('milestones').doc(req.params.milestone_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
}