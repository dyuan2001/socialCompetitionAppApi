const functions = require("firebase-functions");
const admin = require('firebase-admin');

module.exports = {
    postReply: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            await db.collection('replies').doc('/' + body.id + '/')
                .create({
                    commentId: body.commentId,
                    userid: body.userid,
                    text: body.text,
                    reactions: body.reactions,
                });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    getReply: async (req, res, db) => {
        try {
            const document = db.collection('replies').doc(req.params.reply_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    scanReplies: async (req, res, db) => {
        try {
            let query = db.collection('replies');
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    id: doc.id,
                    commentId: doc.data().commentId,
                    userid: doc.data().userid,
                    text: doc.data().text,
                    reactions: doc.data().reactions,
                };
                response.push(selectedItem);
            }
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    updateReply: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            const document = db.collection('replies').doc(req.params.reply_id);
            await document.update({
                commentId: body.commentId,
                userid: body.userid,
                text: body.text,
                reactions: body.reactions,
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    deleteReply: async (req, res, db) => {
        try {
            const document = db.collection('replies').doc(req.params.reply_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
}