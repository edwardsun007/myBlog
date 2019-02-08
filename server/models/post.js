const mongoose = require('mongoose');

// Schema Is ONly bluePrint
var postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  // in order to bind relation between user and post ( which user create this post), we can:
  /* 1: create list of posts under user schema
     2: add creator info in postSchema, we choose 2nd approach here, therefore we store mongoose objectId
     for creator info
     ref property:  tells mongoose to which model this creator (_id) stored here belong -- that is user model


     */
}, {timestamps: true});

module.exports =  mongoose.model("Post", postSchema); // turn blueprint into model


