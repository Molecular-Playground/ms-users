var njwt = require('njwt');
//TODO read from config file
var signingKey = "PLACEHOLDER";

// Accepted Header:
//    Authorization: Token YOUR_TOKEN_HERE
module.exports = function(req,res,next) {
  if(!req.headers.authorization) {
    // token not sent
    res.send({
      status: 401,
      success: false,
      message: "Token was not recieved.\nExpected token in 'Authorization' header with format: 'Token YOUR_TOKEN_HERE'",
    });
  } else {
    var authorizationArray = req.headers.authorization.split(' ');
    if(authorizationArray[0] === 'Token' && authorizationArray[1]) {
      njwt.verify(authorizationArray[1], signingKey, function(err, ver) {
        if(err) {
          // token is expired
          res.send({
            status: 401,
            success: false,
            message: 'Token is expired.',
          });
        } else {
          // token is Gucci!
          req.user = ver.body;
          next();
        }
      });
    } else {
      // token incorrect format
      res.send({
        status: 401,
        success: false,
        message: "Token is not in correct format.\nExpected: 'Token YOUR_TOKEN_HERE'",
      });
    }
  }
}
