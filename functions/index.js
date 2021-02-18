const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

// Service account
var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialcompetitionapp..firebaseio.com"
});
const db = admin.firestore();

// BEGINNING OF FUNCTIONS

// app.get('/hello-world', (req, res) => {
//   return res.status(200).send('Hello World!');
// });

// USERPOSTS

const {postUserpost, getUserpost, scanUserposts, updateUserpost, deleteUserpost} = require('./src/userPosts.js');

/*
JSON Format:
{
    "id": integer - autoscaled (?),
    "userid": String - user's id,
    "userpostPhotoUrl": String - userpost's photo,
    "tags": Str array - list of tags,
    "reactions": int - number of likes,
    "comments": int arr - ids of comments
}
*/

app.post('/api/userpost-post', (req, res) => {
    postUserpost(req, res, db);
});

// GET USERPOST 
app.get('/api/userpost-get/:userpost_id', (req, res) => {
    getUserpost(req, res, db);
});

// SCAN USERPOSTS
app.get('/api/userpost-scan', (req, res) => {
    scanUserposts(req, res, db);
});

// UPDATE USERPOST
app.put('/api/userpost-update/:userpost_id', (req, res) => {
    updateUserpost(req, res, db);
});

// DELETE USERPOST
app.delete('/api/userpost-delete/:userpost_id', (req, res) => {
    deleteUserpost(req, res, db);
});

// COMMENTS

const {getComment, postComment, scanComments, updateComment, deleteComment} = require('./src/comments.js');

/*
JSON Format:
{
    "id": integer - autoscaled (?),
    "userpostId": integer - parent userpostId,
    "userid": String - user's id,
    "text": String - actual comment text,
    "reactions": integer - likes (could be expanded to an array if more types of reactions),
    "replies": int array - ids of replies
}

NOTE: Write function to update parent userPost with comment
*/
app.post('/api/comment-post', (req, res) => {
    postComment(req, res, db);
});

// GET COMMENT 
app.get('/api/comment-get/:comment_id', (req, res) => {
    getComment(req, res, db)
});

// SCAN COMMENTS
app.get('/api/comment-scan', (req, res) => {
    scanComments(req, res, db);
});

// UPDATE COMMENT
app.put('/api/comment-update/:comment_id', (req, res) => {
    updateComment(req, res, db);
});

// DELETE COMMENT
app.delete('/api/comment-delete/:comment_id', (req, res) => {
    deleteComment(req, res, db);
});

// REPLIES

const {postReply, getReply, scanReplies, updateReply, deleteReply} = require('./src/replies.js');


/*
JSON Format:
{
    "id": integer - autoscaled (?),
    "commentId": integer - parent comment's id,
    "userid": String - user's id,
    "text": String - actual reply text,
    "reactions": integer - likes (could be expanded to an array if more types of reactions),
}

NOTE: Write function to update parent comment with reply
*/
app.post('/api/reply-post', (req, res) => {
    postReply(req, res, db);
});

// GET REPLY 
app.get('/api/reply-get/:comment_id', (req, res) => {
    getReply(req, res, db)
});

// SCAN REPLIES
app.get('/api/reply-scan', (req, res) => {
    scanReplies(req, res, db);
});

// UPDATE REPLY
app.put('/api/reply-update/:reply_id', (req, res) => {
    updateReply(req, res, db);
});

// DELETE REPLY
app.delete('/api/reply-delete/:reply_id', (req, res) => {
    deleteReply(req, res, db);
});

// USERS

const {postUser, getUser, scanUsers, updateUser, deleteUser, addFriend, removeFriend, addTag, removeTag, addChallenge, incrementPoints} = require('./src/users.js');

/*
JSON Format:
{
    "id": String - autoscaled (?),
    "points": integer - social competition points,
    "tags": Str arr - array of the user's tags,
    "friends": Str arr - array of the user's friends' ids,
    "userposts": int arr - array of the user's userposts' ids,
    "challenges": int arr - array of the user's completed challenges,
}
*/

// POST USER
app.post('/api/user-post', (req, res) => {
    postUser(req, res, db);
});

// GET USER 
app.get('/api/user-get/:user_id', (req, res) => {
    getUser(req, res, db)
});

// SCAN USERS
app.get('/api/user-scan', (req, res) => {
    scanUsers(req, res, db);
});

// UPDATE USER
app.put('/api/user-update/:user_id', (req, res) => {
    updateUser(req, res, db);
});

// DELETE USER
app.delete('/api/user-delete/:user_id', (req, res) => {
    deleteUser(req, res, db);
});

// ADD FRIEND
app.put('/api/user-add-friend/:user_id/:friend_id', (req, res) => {
    addFriend(req, res, db);
});

// REMOVE FRIEND
app.put('/api/user-remove-friend/:user_id/:friend_id', (req, res) => {
    removeFriend(req, res, db);
});

// ADD TAG
app.put('/api/user-add-tag/:user_id/:tag', (req, res) => {
    addTag(req, res, db);
});

// REMOVE TAG
app.put('/api/user-remove-tag/:user_id/:tag', (req, res) => {
    removeTag(req, res, db);
});

// ADD CHALLENGE
app.put('/api/user-add-challenge/:user_id/:challenge_id', (req, res) => {
    addChallenge(req, res, db);
});

// INCREMENT POINTS
app.put('/api/user-increment-points/:user_id/:points', (req, res) => {
    incrementPoints(req, res, db);
});

// CHALLENGE INFO
const {getInfo, postChallenge} = require('./src/challengeInfo.js');

// POST CHALLENGE
app.put('/api/post-challenge/:user_id/:challenge_info', (req, res) => {
    postChallenge(req, res, db);
});

// GET CHALLENGE INFO
app.get('/api/get-info/:user_id/:challenge_info', (req, res) => {
    getInfo(req, res, db);
});

// MILESTONES
const {setMilestone, editMilestone, removeMilestone, getMilestone} = require('./src/milestones.js');

// SET MILESTONE
app.put('/api/set-milestone/:user_id/:milestones', (req, res) => {
    setMilestone(req, res, db);
});

// EDIT MILESTONE
app.put('/api/edit-milestone/:user_id/:milestones', (req, res) => {
    editMilestone(req, res, db);
});

// REMOVE MILESTONE
app.put('/api/remove-milestone/:user_id/:milestones', (req, res) => {
    removeMilestone(req, res, db);
});

// GET MILESTONE
app.get('/api/get-milestone/:user_id/:milestones', (req, res) => {
    getMilestone(req, res, db);
});


exports.app = functions.https.onRequest(app);
