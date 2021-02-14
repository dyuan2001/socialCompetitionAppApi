const {firestore} = require('firebase-admin')

module.exports = {
    postUser: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            await db.collection('userInfo').doc('/' + body.id + '/')
                .create({
                    points: body.points,
                    tags: body.tags,
                    friends: body.friends,
                    userposts: body.userposts,
                    challenges: body.challenges
                });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    getUser: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    scanUsers: async (req, res, db) => {
        try {
            let query = db.collection('userInfo');
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    id: doc.id,
                    points: doc.data().points,
                    tags: doc.data().tags,
                    friends: doc.data().friends,
                    userposts: doc.data().userposts,
                    challenges: doc.data().challenges
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

    updateUser: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.update({
                points: body.points,
                tags: body.tags,
                friends: body.friends,
                userposts: body.userposts,
                challenges: body.challenges
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    deleteUser: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    addFriend: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.update({
                friends: firestore.FieldValue.arrayUnion(req.params.friend_id),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    removeFriend: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.update({
                friends: firestore.FieldValue.arrayRemove(req.params.friend_id),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    addTag: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.update({
                tags: firestore.FieldValue.arrayUnion(req.params.tag),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    removeTag: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.update({
                tags: firestore.FieldValue.arrayUnion(req.params.tag),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    incrementPoints: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.update({
                points: firestore.FieldValue.increment(parseInt(req.params.points, 10)),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    addChallenge: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.update({
                challenges: firestore.FieldValue.arrayUnion(req.params.challenge_id),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
}