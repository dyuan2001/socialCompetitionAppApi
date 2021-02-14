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

//COMMENTS

const {getComment, postComment, scanComments, updateComment, deleteComment} = require('./src/comments.js');

/* POST COMMENT
JSON Format:
{
    "id": integer - autoscaled (?),
    "parent": integer - parent post,
    "userid": integer - user's id,
    "text": string - actual comment text,
    "reactions": integer - likes (could be expanded to an array if more types of reactions),
    "replies": int array - ids of replies
}
*/
app.post('/api/comment-post', (req, res) => {
    postComment(req, res, db);
});

// GET COMMENT 
app.get('/api/comment-read/:comment_id', (req, res) => {
    getComment(req, res, db)
});

// SCAN COMMENTS
app.get('/api/read', (req, res) => {
    scanComments(req, res, db);
});

// UPDATE COMMENT
app.put('/api/update/:comment_id', (req, res) => {
    updateComment(req, res, db);
});

// DELETE COMMENT
app.delete('/api/delete/:comment_id', (req, res) => {
    deleteComment(req, res, db);
});

exports.app = functions.https.onRequest(app);