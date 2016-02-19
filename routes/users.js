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

// TODO GET specific user
router.get('/:username', function(req, res, next) {
  res.send('respond with a resource');
});

// TODO create user
router.put('/', function(req, res, next) {
  // todo: create validation url here
  var validationURL = 'url';
  var username =  req.body.username;
  var email =     req.body.email;
  var location =  req.body.location ? req.query.location : null;
  var password = req.body.password;
  if(validationURL && username && email && password){
    bcrypt.hash(req.query.password, null, null, function(err, hash){
      var qString = 'INSERT INTO users (username, email, password, validation_url, location) VALUES ($1, $2, $3, $4, $5)';
      db.query({text: qString, values: [username, email, hash, validationURL, location]}, function(err, success){
        if(err) {
          res.send("Couldn't create user");
        }
        else {
          // todo: send email
          res.send('User created!');
        }
      });
    });
  }
  else {
    res.send("Didn't recieve required information"); 
  }
});

// TODO update user
router.post('/:username', function(req, res, next) {
  res.send('respond with a resource');
});

// TODO DELETE user
router.delete('/:username', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
