const functions = require("firebase-functions");
const admin = require('firebase-admin');

const {addComment} = require('./userposts.js');

module.exports = {
    postComment: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            await db.collection('comments').doc()
                .add({
                    userpostId: body.userpostId,
                    userid: body.userid,
                    text: body.text,
                    reactions: body.reactions,
                    replies: body.replies,
                    timestamp: Date.now()
                })
                .then((docRef) => {
                    addComment(docRef.id, body.userpostId, db);
                })
                .catch((error) => {
                    console.log("Error adding comment: ", error);
                })

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
                    userpostId: doc.data().userpostId,
                    userid: doc.data().userid,
                    text: doc.data().text,
                    reactions: doc.data().reactions,
                    replies: doc.data().replies
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

    addReply: async (reply_id, comment_id, db) => { // NOT API
        try {
            const document = db.collection('comments').doc(comment_id);
            await document.update({
                replies: firestore.FieldValue.arrayUnion(reply_id),
            });
            return "Successful updating comments!";
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    addReaction: async (comment_id, db) => { // NOT API
        try {
            const document = db.collection('comments').doc(comment_id);
            await document.update({
                reactions: firestore.FieldValue.increment(1),
            });
            return "Successful reaction addition!";
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    scanUserpostComments: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            let query = db.collection('comments').where("userpostId", "==", body.userpost_id).orderBy("timestamp", "desc");
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    id: doc.id,
                    userpostId: doc.data().userpostId,
                    userid: doc.data().userid,
                    text: doc.data().text,
                    reactions: doc.data().reactions,
                    replies: doc.data().replies,
                    timestamp: doc.data().timestamp
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
}