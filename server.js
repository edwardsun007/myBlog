const app = require("./server/app");
const express = require("express");
const http = require('http');
const debug = require('debug')('node-angular');
// const express = require('express');
// const bodyparser = require('body-parser');
// var mongoose = require('mongoose');

// /* router */
// const postsRoutes = require('./server/routes/route');

/* import our models */
// const Post = require('./server/models/post');

// const app =  express();
// /* connect to MongoDB atlas */
// mongoose.connect("mongodb+srv://dev007:DOZbYKwOgSzdjXq3@cluster0-93fyy.mongodb.net/udemy-posts?retryWrites=true")
//   .then(() => {
//     console.log('Connected to database!');
//   })
//   .catch(() => {
//     console.log('Connection failed!');
//   });

// app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({ extended: false }));

// To fix CORS Error
// app.use((req, res, next)=>{
//   res.setHeader('Access-Control-Allow-Origin', "*"); // no matter which domain is sending request, it will be allowed to access our resource
//   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS"); // define which HTTP verbs are allowed to sent request
//   next();  // include this to let express scan the next middleware
// });

// app.use("/api/posts",postsRoutes); // only urls starts with /api/posts will go to postsRoutes

// // imgStore dir
// app.use("/images", express.static(__dirname +"/server/imgStore"));
// console.log(__dirname +"/server/imgStore");

//const app = require('./backend/app');
// app.use(express.static( __dirname + '/dist/mean-course' ));
// console.log(__dirname + '/dist/mean-course');


app.use(express.static( __dirname + '/dist/mean-course' ));
console.log(__dirname + '/dist/mean-course');

/* little trick for error proof on port number */
const normalizePort = val =>{
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >=0 ){
    return port;
  }

  return false;
};

const onError = error => {
  if(error.syscall !== "listen"){
    throw error;
  }

  const bind = typeof addr === "string" ? "pipe" + addr : "port " + port;
  switch (error.code){
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;

    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || 3000);
app.set('port',port);

const server = http.createServer(app);
server.on("error", onError); // catch event error, callback onError
server.on("listening", onListening); // catch event listening, callback onListening
server.listen(port,()=>{
  console.log(`server.js running on ${port}`);
});
