const functions = require("firebase-functions");
const {firestore} = require('firebase-admin');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const {getUser, addUserpost} = require('./users.js');

module.exports = {
    postUserpost: async (req, res, db) => {
        const body = req.body;

        // let url = await getPhotoURL(body.uri, body.userid);

        try {
            await db.collection('userposts')
                .add({
                    userid: body.userid,
                    username: body.username,
                    userpostPhotoUrl: body.userpostPhotoUrl,
                    caption: body.caption,
                    link: body.link,
                    cause: body.cause,
                    tag: body.tag,
                    reactions: body.reactions,
                    comments: body.comments,
                    reactionUsers: body.reactionUsers,
                    timestamp: Date.now()
                })
                .then((docRef) => {
                    addUserpost(docRef.id, body.userid, db);
                })
                .catch((error) => {
                    console.log("Error adding userpost: ", error);
                })
            
            // userInfo = await fetch(`https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-get/${body.userid}`);
            // body.tags.forEach(tag => {
            //     let milestoneInfo = fetch(`https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/milestone-get/${userid}-${tag}`);
            //     if (milestoneInfo == null) {
            //         postMilestone({
            //             id: `${userid}-${tag}`,
            //             userid: body.userid,
            //             tag: tag,
            //             heading: `${tag} - Bronze`,
            //             text: `Milestone for reaching Bronze achievement in ${tag}.`,
            //             progress: 1,
            //         }, db);
            //     } else {
            //         updateMilestoneProgress(`${userid}-${tag}`, db);
            //     }
            // });

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
            let query = db.collection('userposts').orderBy("timestamp", "desc");
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    id: doc.id,
                    userid: doc.data().userid,
                    username: doc.data().username,
                    userpostPhotoUrl: doc.data().userpostPhotoUrl,
                    caption: doc.data().caption,
                    link: doc.data().link,
                    cause: doc.data().cause,
                    tag: doc.data().tag,
                    reactions: doc.data().reactions,
                    comments: doc.data().comments,
                    reactionUsers: doc.data().reactionUsers,
                    timestamp: doc.data().timestamp,
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
                userid: body.userid,
                username: body.username,
                userpostPhotoUrl: body.userpostPhotoUrl,
                caption: body.caption,
                link: body.link,
                cause: body.cause,
                tag: body.tag,
                reactions: body.reactions,
                comments: body.comments,
                reactionUsers: body.reactionUsers
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

    addComment: async (comment_id, userpost_id, db) => { // NOT API
        try {
            const document = db.collection('userposts').doc(userpost_id);
            await document.update({
                comments: firestore.FieldValue.arrayUnion(comment_id),
            });
            return "Successful updating comments!";
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    addUserpostReaction: async (req, res, db) => { // NOT API
        try {
            const document = db.collection('userposts').doc(req.params.userpost_id);
            await document.update({
                reactions: firestore.FieldValue.increment(1),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    removeUserpostReaction: async (req, res, db) => { // NOT API
        try {
            const document = db.collection('userposts').doc(req.params.userpost_id);
            await document.update({
                reactions: firestore.FieldValue.increment(-1),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    scanUserUserposts: async (req, res, db) => {
        try {
            let query = db.collection('userposts').where("userid", "==", req.params.user_id).orderBy("timestamp", "desc");
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    id: doc.id,
                    userid: doc.data().userid,
                    username: doc.data().username,
                    userpostPhotoUrl: doc.data().userpostPhotoUrl,
                    caption: doc.data().caption,
                    link: doc.data().link,
                    cause: doc.data().cause,
                    tag: doc.data().tag,
                    reactions: doc.data().reactions,
                    comments: doc.data().comments,
                    reactionUsers: doc.data().reactionUsers,
                    timestamp: doc.data().timestamp,
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

    addUserpostTag: async (req, res, db) => { // OUTDATED. Don't use.
        try {
            const document = db.collection('userposts').doc(req.params.userpost_id);
            await document.update({
                tags: firestore.FieldValue.arrayUnion(req.params.tag),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    removeUserpostTag: async (req, res, db) => { // OUTDATED. Don't use.
        try {
            const document = db.collection('userposts').doc(req.params.userpost_id);
            await document.update({
                tags: firestore.FieldValue.arrayRemove(req.params.tag),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    addUserpostReactionUser: async (req, res, db) => {
        try {
            const document = db.collection('userposts').doc(req.params.userpost_id);
            await document.update({
                reactionUsers: firestore.FieldValue.arrayUnion(req.params.reaction_userid),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    removeUserpostReactionUser: async (req, res, db) => {
        try {
            const document = db.collection('userposts').doc(req.params.userpost_id);
            await document.update({
                reactionUsers: firestore.FieldValue.arrayRemove(req.params.reaction_userid),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
}

// async function getPhotoURL(uri, userid) {
//     const photo = await getBlob(uri);
//     const imageRef = firebase.storage().ref("userpostPhotos").child(Date.now() + userid);
//     await imageRef.put(photo);
//     const url = await imageRef.getDownloadURL();
//     return url;
// }

// async function getBlob (uri) {
//     return await new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();

//         xhr.onload = () => {
//             resolve(xhr.response);
//         }
//         xhr.onerror = () => {
//             reject(new TypeError("Network request failed."));
//         }

//         xhr.responseType = "blob";
//         xhr.open("GET", uri, true);
//         xhr.send(null);
//     })
// }