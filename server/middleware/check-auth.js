/*

In order to grant user access to protected routes such as
delete post -- we don't want all user be able to do these
edit post
....
this ts file handles the above task by these steps:
1. check user has a token attached to a request
2. validate the token attached to it


*/

const jwt = require('jsonwebtoken');

// experiment -- user router to navigate to login page
const router = require('@angular/router');

/* middleware should be function not class */
module.exports = (req, res, next) => {
  /* if its not authenticated there will be no token in header, so wrap it in try */
  try {
    const token = req.headers.authorization.split(" ")[1]; // 2nd part after Bearer space
    const decodedToken = jwt.verify(token,'secret_usually_should_be_longer');   // verify the token, secret has to be same used for creating the token
    req.userData = {email: decodedToken.email, userId: decodedToken.userId}; // makesure there is no duplicate userData field in the original req object
    next();
    // keep in mind, next() allow us to go to th next middleware and any fields/members we created before next() line gonna stay
    // any middleware running after next() has access to req.userData field
    // if no error proceed
  } catch (error) {
    // jwt.verify fails will also throw error, make sure its inside try block
    res.status(401).json({message:'check-auth->Auth failed!'});
  }
  // typical token format: "Bearer somelongtokenstring"

};
