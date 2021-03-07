const functions = require("firebase-functions");
const {firestore} = require('firebase-admin');

module.exports = {
    postChallenge: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            await db.collection('challenges').doc('/' + body.id + '/')
                .create({
                    userpostId: body.userpostId,
                    heading: body.heading,
                    description: body.description
                });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    getChallenge: async (req, res, db) => {
        try {
            const document = db.collection('challenges');
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    removeChallenge: async (req, res, db) => {
        try {
            const document = db.collection('challenges').doc(req.params.challenge_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
}