const functions = require("firebase-functions");
const admin = require('firebase-admin');

const {updateMilestoneProgress, postMilestone} = require('./milestones.js');
const {getUser} = require('./users.js');

module.exports = {
    postUserpost: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            await db.collection('userposts').doc('/' + body.id + '/')
                .create({
                    userid: body.userid,
                    userpostPhotoUrl: body.userpostPhotoUrl,
                    tags: body.tags,
                    reactions: body.reactions,
                    comments: body.comments
                });
            
            userInfo = await fetch(`https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-get/${body.userid}`);
            body.tags.forEach(tag => {
                let milestoneInfo = fetch(`https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/milestone-get/${userid}-${tag}`);
                if (milestoneInfo == null) {
                    postMilestone({
                        id: `${userid}-${tag}`,
                        userid: body.userid,
                        tag: tag,
                        heading: `${tag} - Bronze`,
                        text: `Milestone for reaching Bronze achievement in ${tag}.`,
                        progress: 1,
                    }, db);
                } else {
                    updateMilestoneProgress(`${userid}-${tag}`, db);
                }
            });

            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    getUserpost: async (req, res, db) => {
        try {
            const document = db.collection('userposts').doc(req.params.userpost_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    scanUserposts: async (req, res, db) => {
        try {
            let query = db.collection('userposts');
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    id: doc.id,
                    userid: doc.data().userid,
                    userpostPhotoUrl: doc.data().userpostPhotoUrl,
                    tags: doc.data().tags,
                    reactions: doc.data().reactions,
                    comments: doc.data().comments
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

    updateUserpost: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            const document = db.collection('userposts').doc(req.params.userpost_id);
            await document.update({
                id: body.id,
                userid: body.userid,
                userpostPhotoUrl: body.userpostPhotoUrl,
                tags: body.tags,
                reactions: body.reactions,
                comments: body.comments
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    deleteUserpost: async (req, res, db) => {
        try {
            const document = db.collection('userposts').doc(req.params.userpost_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
}