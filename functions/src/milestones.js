const functions = require("firebase-functions");
const {firestore} = require('firebase-admin');
const {addMilestone} = require('./users.js');

module.exports = {
    postMilestone: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            await db.collection('milestones').doc('/' + body.id + '/')
                .create({
                    userid: body.userid,
                    tag: body.tag,
                    heading: body.heading,
                    text: body.text,
                    progress: body.progress,
                });

            // addMilestone(body.id, userid, db);

            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    getMilestone: async (req, res, db) => {
        try {
            const document = db.collection('milestones').doc(req.params.milestone);
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
                userid: body.userid,
                tag: body.tag,
                heading: body.heading,
                text: body.text,
                progress: body.progress,
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    updateMilestoneProgress: async (req, res, db) => {
        try {
            const document = db.collection('milestones').doc(req.params.milestone_id);
            await document.update({
                progress: firestore.FieldValue.increment(1),
            });
        } catch (error) {
            console.log(error);
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