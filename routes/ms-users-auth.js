var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var auth = require('../lib/auth.js');

// edit user
router.post('/', auth, function(req, res, next){
  var location = req.body.location;
  var id = req.user.sub;
  if(req.user.username || location){
    var qString = "UPDATE users SET location = $1 WHERE uid = $2";
    db.query({text:qString, values: [location,id]}, function(err,success){
      if(err) {next(err);return;}
      res.send({
        success: true,
        message: 'location updated'
      });
    });
  }
  else{
    var err = new Error("Username or location not provided");
    err.status = 400;
    next(err);
  }
});

// delete user
// TODO Admin only once we make admins (or explore other options)
router.delete('/:username', auth, function(req, res, next) {
  var username = req.params.username;
  var qString = 'DELETE FROM users WHERE username = $1';
  db.query({text: qString, values: [username]}, function(err, success){
    if(err) {next(err);return;}
    res.send({
      success: true,
      message: "Deleted " + username
    });
  });
});

module.exports = router;
