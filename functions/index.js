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

// GET COMMENT 
app.get('/api/userpost-get/:userpost_id', (req, res) => {
    getUserpost(req, res, db);
});

// SCAN COMMENTS
app.get('/api/userpost-scan', (req, res) => {
    scanUserposts(req, res, db);
});

// UPDATE COMMENT
app.put('/api/userpost-update/:userpost_id', (req, res) => {
    updateUserpost(req, res, db);
});

// DELETE COMMENT
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

// GET COMMENT 
app.get('/api/reply-get/:comment_id', (req, res) => {
    getReply(req, res, db)
});

// SCAN COMMENTS
app.get('/api/reply-scan', (req, res) => {
    scanReplies(req, res, db);
});

// UPDATE COMMENT
app.put('/api/reply-update/:reply_id', (req, res) => {
    updateReply(req, res, db);
});

// DELETE COMMENT
app.delete('/api/reply-delete/:reply_id', (req, res) => {
    deleteReply(req, res, db);
});

// USERS



/*
JSON Format:
{
    "id": String - autoscaled (?),
    "points": integer - social competition points,
    "tags": Str arr - array of the user's tags,
    "text": String - actual reply text,
    "reactions": integer - likes (could be expanded to an array if more types of reactions),
}

NOTE: Write function to update parent comment with reply
*/

exports.app = functions.https.onRequest(app);