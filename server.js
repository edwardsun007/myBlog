const app = require("./server/app");
const express = require("express");
const http = require("http");
const debug = require("debug")("node-angular");

app.use(express.static(__dirname + "/dist/mean-course"));
console.log(__dirname + "/dist/mean-course");

/* little trick for error proof on port number */
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof addr === "string" ? "pipe" + addr : "port " + port;
  switch (error.code) {
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
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError); // catch event error, callback onError
server.on("listening", onListening); // catch event listening, callback onListening
server.listen(port, () => {
  console.log(`server.js running on ${port}`);
});
