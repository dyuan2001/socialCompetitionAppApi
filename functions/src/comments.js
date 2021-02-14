const functions = require("firebase-functions");
const admin = require('firebase-admin');

module.exports = {
    postComment: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            await db.collection('comments').doc('/' + body.id + '/')
                .create({
                    parent: body.parent,
                    userid: body.userid,
                    text: body.text,
                    reactions: body.reactions,
                    replies: body.replies,
                });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    getComment: async (req, res, db) => {
        try {
            const document = db.collection('comments').doc(req.params.comment_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    scanComments: async (req, res, db) => {
        try {
            let query = db.collection('comments');
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    id: doc.id,
                    parent: doc.data().parent,
                    userid: doc.data().userid,
                    text: doc.data().text,
                    reactions: doc.data().reactions,
                    replies: doc.data().replies,
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

    updateComment: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            const document = db.collection('comments').doc(req.params.comment_id);
            await document.update({
                id: body.id,
                parent: body.parent,
                userid: body.userid,
                text: body.text,
                reactions: body.reactions,
                replies: body.replies,
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    deleteComment: async (req, res, db) => {
        try {
            const document = db.collection('comments').doc(req.params.comment_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
}