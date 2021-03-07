const functions = require("firebase-functions");
const {firestore} = require('firebase-admin');
const {addMilestone} = require('./users.js');

module.exports = {
    postMilestone: async (milestone_params, db) => {
        try {
            await db.collection('milestones').doc('/' + milestone_params.id + '/')
                .create({
                    userid: milestone_params.userid,
                    tag: milestone_params.tag,
                    heading: milestone_params.heading,
                    text: milestone_params.text,
                    progress: milestone_params.progress,
                });

            addMilestone(milestone_params.id, userid, db);

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

    updateMilestoneProgress: async (milestone_id, db) => {
        try {
            const document = db.collection('milestones').doc(milestone_id);
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