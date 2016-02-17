var express = require('express');
var router = express.Router();

// TODO GET users listing
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// TODO GET specific user
router.get('/:username', function(req, res, next) {
  res.send('respond with a resource');
});

// TODO create user
router.put('/:username', function(req, res, next) {
  var username =  req.params.username;
  var email =     req.query.email;
  var password =  req.query.password; //TODO hash password
  var location =  req.query.location;
  res.send('respond with a resource');
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
