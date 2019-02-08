const express = require("express");
const multer = require("multer");
const Post = require("../models/post");

const checkAuth = require('../middleware/check-auth'); // our middleware for check and verify token, add it in routes you want to protect
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => { // called when multer tries to save file
                //request, file, callback
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {  // if its known extention set error to null
        error = null;
      }
      cb(error, "server/images"); // this path is relative to server.js not route.js
  },
  filename: (req,file,cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');//replace whitespace with dash
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now()+ '.' + ext)
  }
});



/* RESTful API */
// Add an new post
// add multer middleware, single means we only expect 1 single file
router.post("",
checkAuth,
multer({storage: storage}).single("image"), (req, res)=>{

  console.log('req.get(host)=',req.get("host")); // localhost:3000
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({ // initiate instance of our model with javascript object
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename, // post request create imagePath that has url /images/ in it
    creator: req.userData.userId
  });
  post.save().then(
    createdPost => {
      res.status(201).json({
        message: "Post added",
        post: {
          ...createdPost,
          id:createdPost._id
          // title: createdPost.title,
          // content: createdPost.content,
          // imagePath: createdPost.imagePath
        }
      });
    }
  )
  .catch(err=>{
    res.json({error:err});
  });
});

// update a post by id, however we could possibly update it with a new image !
router.put("/:id",
  checkAuth,  // after url path, before get to image
  multer({storage: storage}).single("image"),
  (req,res)=>{
  let imagePath = req.body.imagePath; // from service updatePost, we are not uploading new file
  console.log('update api called:', req.params.id);
  if(req.file){ // if user updated the image , then it is file type! follow logic in post
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename; // CREATE path for new image
  }
  // req.file should be undefined if user is not uploading new image
  // because there is no File type, the image is string
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log('post=',post);
  // now we let check-auth decode token and return userId, we can add another condition for updateOne
  // that creator is userId decoded
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then( result=> {
    if (result.nModified > 0){
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({message: "Not Authorized!"});
    }
  });
});

// get all posts
router.get("", checkAuth, (req,res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const curUID = req.userData.userId;
  const postQuery = Post.find({creator: curUID});
  /* angular paginator's length should be total num of docs that created by this user
   so we need to run countDocuments query to get total posts amount created by this user
   after that we run skip and limit query chaining to limit doc returned for each page!
   */
  Post.countDocuments( {creator: curUID},(err, result)=>{
    if(err){
      console.log('route.js->countDoc.err',err);
      return res.status(500).json({error:err});
    }
    return result;
  })
  .then( countRes => {
    console.log('countRes=',countRes);
    let fetchedPostsWLimit;
    if (pageSize && currentPage){
      postQuery.skip(pageSize * (currentPage - 1)) // pagination good practice !
      .limit(pageSize);
      // limit number of docs MongoDB query returns
      // mongoose function skip--specify number of documents to skip
      // page 2 - 1 = 1 * pageSize e.g 10 = 10 ,  page 3 - 1 = 2 * 10 = 20
    }
    postQuery.then(documents => {
      fetchedPostsWLimit = documents // store fetched posts
      console.log('fetchedPostsWLimit.length=',fetchedPostsWLimit.length);
      res.status(200).json({
        message: "Post fetched successfully!",
        data: fetchedPostsWLimit,
        maxPosts: countRes
        });
      // return fetchedPostsWLimit.length; // number of fetchedPosts
      // once executed find() call another query count() and we don't need .then() here because it will
      // listen for the next
    }) /*.then( fetchedlen => {
      res.status(200).json({
        message: "Post fetched successfully!",
        data: fetchedPostsWLimit,
        maxPosts: countRes
        });
    })*/
  });

});


// get single post based on id
router.get("/:id", (req,res) => {
  console.log('get route /:id called:',req.params.id);
  console.log('\n');
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post); // if post not empty / undefined return it
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
  .catch(err=>{
    res.json({error:err});
  })
});

// delete a post by id
router.delete("/:id", checkAuth, (req,res) => {
  console.log('API->deleteOne->called:', req.params.id);

  Post.deleteOne({_id:req.params.id, creator: req.userData.userId}).then(
    result => {
      console.log('del result:', result);
      if (result.n > 0){
        res.status(200).json({ message: "Post deleted!"});
      } else {
        res.status(401).json({ message: "UnAuthorized Delete!"});
      }
    })
  // Post.findOneAndDelete({_id:req.params.id, creator: req.userData.userId}, (err, result)=>{

  //   if(err){
  //     res.json('delete failed! ',err);
  //   }else{
  //     res.status(200).json({ message: "Post deleted!"});
  //   }
  // });
});

module.exports = router;
