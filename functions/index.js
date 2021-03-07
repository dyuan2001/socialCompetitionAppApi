const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({origin: true}));

// Service account
const serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialcompetitionapp..firebaseio.com",
});
const db = admin.firestore();

// BEGINNING OF FUNCTIONS

// app.get('/hello-world', (req, res) => {
//   return res.status(200).send('Hello World!');
// });

// USERPOSTS

const {
    postUserpost, 
    getUserpost, 
    scanUserposts, 
    updateUserpost, 
    deleteUserpost,
    scanUserUserposts,
    addUserpostReaction,
} = require("./src/userPosts.js");

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

app.post("/api/userpost-post", (req, res) => {
  postUserpost(req, res, db);
});

// GET USERPOST
app.get("/api/userpost-get/:userpost_id", (req, res) => {
  getUserpost(req, res, db);
});

// SCAN USERPOSTS
app.get("/api/userpost-scan", (req, res) => {
  scanUserposts(req, res, db);
});

// UPDATE USERPOST
app.put("/api/userpost-update/:userpost_id", (req, res) => {
  updateUserpost(req, res, db);
});

// DELETE USERPOST
app.delete("/api/userpost-delete/:userpost_id", (req, res) => {
  deleteUserpost(req, res, db);
});

// USERPOST REACTION
app.post("/api/userpost-reaction/:userpost_id", (req, res) => {
  addUserpostReaction(req, res, db);
});

// SCAN USER USERPOSTS
app.get("/api/userpost-user-scan", (req, res) => {
  scanUserUserposts(req, res, db);
});

// COMMENTS

const {
    getComment, 
    postComment,
    scanComments, 
    updateComment, 
    deleteComment,
    scanUserpostComments,
    addCommentReaction,
} = require("./src/comments.js");

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
app.post("/api/comment-post", (req, res) => {
  postComment(req, res, db);
});

// GET COMMENT
app.get("/api/comment-get/:comment_id", (req, res) => {
  getComment(req, res, db);
});

// SCAN COMMENTS
app.get("/api/comment-scan", (req, res) => {
  scanComments(req, res, db);
});

// UPDATE COMMENT
app.put("/api/comment-update/:comment_id", (req, res) => {
  updateComment(req, res, db);
});

// DELETE COMMENT
app.delete("/api/comment-delete/:comment_id", (req, res) => {
  deleteComment(req, res, db);
});

// COMMENT REACTION
app.post("/api/comment-reaction/:reply_id", (req, res) => {
  addCommentReaction(req, res, db);
});

// SCAN USERPOST COMMENTS
app.get("/api/comment-userpost-scan", (req, res) => {
  scanUserpostComments(req, res, db);
});

// REPLIES

const {
    postReply, 
    getReply, 
    scanReplies, 
    updateReply, 
    deleteReply,
    scanCommentReplies,
    addReplyReaction,
} = require("./src/replies.js");


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
app.post("/api/reply-post", (req, res) => {
  postReply(req, res, db);
});

// GET REPLY
app.get("/api/reply-get/:comment_id", (req, res) => {
  getReply(req, res, db);
});

// SCAN REPLIES
app.get("/api/reply-scan", (req, res) => {
  scanReplies(req, res, db);
});

// UPDATE REPLY
app.put("/api/reply-update/:reply_id", (req, res) => {
  updateReply(req, res, db);
});

// DELETE REPLY
app.delete("/api/reply-delete/:reply_id", (req, res) => {
  deleteReply(req, res, db);
});

// SCAN COMMENT REPLIES
app.get("/api/reply-comment-scan", (req, res) => {
  scanCommentReplies(req, res, db);
});


// USERS

const {
    postUser, 
    getUser, 
    scanUsers, 
    updateUser, 
    deleteUser, 
    addFriend, 
    removeFriend, 
    addTag, 
    removeTag, 
    addChallenge, 
    incrementPoints
} = require("./src/users.js");

/*
JSON Format:
{
    "id": String - autoscaled (?),
    "points": integer - social competition points,
    "tags": Str arr - array of the user's tags,
    "friends": Str arr - array of the user's friends' ids,
    "userposts": int arr - array of the user's userposts' ids,
    "challenges": int arr - array of the user's completed challenges,
    "milestones": int arr - array of the user's milestones,
}
*/

// POST USER
app.post("/api/user-post", (req, res) => {
  postUser(req, res, db);
});

// GET USER
app.get("/api/user-get/:user_id", (req, res) => {
  getUser(req, res, db);
});

// SCAN USERS
app.get("/api/user-scan", (req, res) => {
  scanUsers(req, res, db);
});

// UPDATE USER
app.put("/api/user-update/:user_id", (req, res) => {
  updateUser(req, res, db);
});

// DELETE USER
app.delete("/api/user-delete/:user_id", (req, res) => {
  deleteUser(req, res, db);
});

// ADD FRIEND
app.put("/api/user-add-friend/:user_id/:friend_id", (req, res) => {
  addFriend(req, res, db);
});

// REMOVE FRIEND
app.put("/api/user-remove-friend/:user_id/:friend_id", (req, res) => {
  removeFriend(req, res, db);
});

// ADD TAG
app.put("/api/user-add-tag/:user_id/:tag", (req, res) => {
  addTag(req, res, db);
});

// REMOVE TAG
app.put("/api/user-remove-tag/:user_id/:tag", (req, res) => {
  removeTag(req, res, db);
});

// ADD CHALLENGE
app.put("/api/user-add-challenge/:user_id/:challenge_id", (req, res) => {
  addChallenge(req, res, db);
});

// INCREMENT POINTS
app.put("/api/user-increment-points/:user_id/:points", (req, res) => {
  incrementPoints(req, res, db);
});

// CHALLENGES
const {
    getChallenge, 
    postChallenge, 
    removeChallenge
} = require("./src/challenges.js");

// POST CHALLENGE
app.post("/api/challenges", (req, res) => {
  postChallenge(req, res, db);
});

// GET CHALLENGE
app.get("/api/challenges", (req, res) => {
  getChallenge(req, res, db);
});

// REMOVE CHALLENGE
app.delete("/api/challenges/:challenge_id", (req, res) => {
  removeChallenge(req, res, db);
});

// MILESTONES
const {
    postMilestone, 
    editMilestone, 
    deleteMilestone, 
    getMilestone
} = require("./src/milestones.js");

// SET MILESTONE
app.post("/api/milestones-post/", (req, res) => {
  postMilestone(req, res, db);
});

// EDIT MILESTONE
app.put("/api/milestones-edit/:milestone_id", (req, res) => {
  editMilestone(req, res, db);
});

// DELETE MILESTONE
app.put("/api/milestones-delete/:milestone_id", (req, res) => {
  deleteMilestone(req, res, db);
});

// GET MILESTONE
app.get("/api/milestones-get/:milestone_id", (req, res) => {
  getMilestone(req, res, db);
});


exports.app = functions.https.onRequest(app);
