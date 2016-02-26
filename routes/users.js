var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var bcrypt = require('bcrypt-nodejs');

// GET users listing
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM users', function(err, result){
    if(err) {
      next(err); //TODO this is most likely wrong
    } else {
      res.send(result.rows);
    }
  });
});

// GET specific user
router.get('/:username', function(req, res, next) {
  var qString = 'SELECT * FROM users WHERE username = $1'
  var username = req.params.username;
  db.query({text: qString, values: [username]}, function(err, result){
    if(err) {
      next(err); //TODO this is most likely wrong
    } else {
      res.send(result.rows);
    }
  });
});

// TODO create user
router.put('/', function(req, res, next) {
  // http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
  function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
  }
  var validationURL = randomString(30);
  var username =  req.body.username;
  var email =     req.body.email;
  var location =  req.body.location ? req.query.location : null;
  var password = req.body.password;
  var salt = bcrypt.genSaltSync(10)
  if(validationURL && username && email && password){
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(password, salt, null, function(err, hash){
        console.log(hash);
        var qString = 'INSERT INTO users (username, email, password, validation_url, location) VALUES ($1, $2, $3, $4, $5)';
        db.query({text: qString, values: [username, email, hash, validationURL, location]}, function(err, success){
          if(err) {
            res.send(err.detail);
          }
          else {
            // todo: send email
            res.send('User created!');
          }
        });
      });
    });

  }
  else {
    res.send("Didn't recieve required information");
  }
});

// validate user: Uses the query string, because it will be given in an email as a full URL. TODO Should be a GET request, but I left it as a PATCH request for now to avoid conflicting with other routes.
router.patch('/validate', function(req, res, next){
  var email = req.body.email;
  var key = req.body.key;
  if(email && key){
    var qString = 'SELECT validation_url FROM users WHERE email = $1';
    db.query({text: qString, values: [email]}, function(err, results){
      if(err) {
        res.send(err.detail);
      }
      else {
        if(results.rows[0] && (key === results.rows[0].validation_url)){
          var qString2 = 'UPDATE users SET validated=TRUE WHERE email = $1';
          db.query({text: qString2, values: [email]}, function(err, success){
            if(err) {
              res.send(err.detail);
            }
            else {
              res.send("Validated " + email);
            }
          });
        }
        else { //if(results.rows[0] && (key === results.rows[0].validation_url))
          res.send("Invalid URL.");
        }
      }
    });
  }
  else { //if(email && key)
    res.send("email or key not specified.");
  }
});

// TODO update user
router.post('/:username', function(req, res, next) {
  res.send('respond with a resource');
});

// DELETE user TODO Admin only once we make admins.
router.delete('/:username', function(req, res, next) {
  var username = req.params.username;
  var qString = 'DELETE FROM users WHERE username = $1';
  db.query({text: qString, values: [username]}, function(err, success){
    if(err) {
      res.send(err.detail);
    }
    else {
      res.send("Deleted " + username);
    }
  });
});

module.exports = router;
