var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var MS_EMAIL_URL = "http://msemail:3000";
var MS_FRONTEND_URL = "http://msfrontend:3000";

// Used in / and /re-validate for generating validation URLs
function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

// get users listing
router.get('/', function(req, res, next) {
  db.query('SELECT username FROM users', function(err, result){
    if(err) {next(err);return;}
    res.send(result.rows);
  });
});

// get specific user
router.get('/:username', function(req, res, next) {
  var qString = 'SELECT * FROM users WHERE username = $1';
  var username = req.params.username;
  db.query({text: qString, values: [username]}, function(err, result){
    if(err) {next(err);return;}
    if(result.rows) res.send(result.rows[0]);
    else res.send({
      success: false,
      message: 'user not found'
    });
  });
});

// create user
router.put('/', function(req, res, next) {
  // http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
  
  var validationURL = randomString(30);
  var username =  req.body.username;
  var email =     req.body.email;
  var location =  req.body.location
  var password = req.body.password;
  var salt = bcrypt.genSaltSync(10);
  if(validationURL && username && email && password){
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(password, salt, null, function(err, hash){
        var qString = 'INSERT INTO users (username, email, password, validation_url, location) VALUES ($1, $2, $3, $4, $5)';
        db.query({text: qString, values: [username, email, hash, validationURL, location]}, function(err, success){
          if(err) {next(err);return;}
          var reqParams = {
	            url: MS_EMAIL_URL + '/validate',
	            method: 'PUT',
	            json: true,
	            body: {
                email: email,
                link: MS_FRONTEND_URL + "/validate?email=" + email + "&key=" + validationURL
              }
          };
          request(reqParams, function (error, response, body) {
            if(error) {next(error);return;}
      			res.send({
              success: true
            });
        	});
        });
      });
    });
  } else {
    var err = new Error("Required information has not been given. Ensure that a username, email, and password are all specified.");
    next(err);
  }
});

// Validate a user. Takes a username and a url (aka 'key')
// that was emailed during the creation process and
// updates the 'validated' column in the user's db object.
router.post('/validate', function(req, res, next){
  var email = req.body.email;
  var key = req.body.key;
  if(email && key){
    var qString = 'SELECT validation_url FROM users WHERE email = $1';
    db.query({text: qString, values: [email]}, function(err, results){
      if(err) {next(err);return;}
      if(results.rows[0] && (key === results.rows[0].validation_url)){
        var qString2 = 'UPDATE users SET validated=TRUE WHERE email = $1';
        db.query({text: qString2, values: [email]}, function(err, success){
          if(err) {
            res.send({
              success: false,
              message: "Database error",
              error: err
            });
          }
          else {
            res.send({
              success: true,
              message: "Validated " + email
            });
          }
        });
      } else { //if(results.rows[0] && (key === results.rows[0].validation_url))
        res.send({
          success: false,
          message: "Validation url specified does not exist in the database."
        });
      }
    });
  }
  else { //if(email && key)
    res.send({
      success: false,
      message: "Email or key not properly specified (this is most likely a front-end developer error)."
    });
  }
});

/*
 * A route to resend the validation email for a specific user.
 * Requires a body param containing the user's EMAIL.
 * Returns success or failure to the calling function.
 */
router.post('/resend-validation', function(req, res, next){
  var email = req.body.email;
  // Generate a new validation URL for the user.
  var validationURL = randomString(30);
  if (email) {
    var query = "SELECT * FROM users WHERE email = $1"
    // First, get the user object from database.
    db.query({text: query, values: [email]}, function(err, results){
      if (err) {
        res.send({success: false, message: "Database error", error: err});
      }
      else {
        console.log(results);
        // Assuming user exists, update their validation_url to
        // the one we just created.
        var insertQuery = "UPDATE users SET validation_url=$1 WHERE email=$2";
        db.query({text: query, values:[validationURL, email]}, function(err, result){
          if (err) {
            res.send({success: false, message: "Database error", error: err});
          }
          else {
            console.log(result);
            // Prepare and send a request to ms-email
            var reqParams = {
                        url: MS_EMAIL_URL + '/validate',
                        method: 'PUT',
                        json: true,
                        body: {
                          email: email,
                          link: MS_FRONTEND_URL + "/validate?email=" + email + "&key=" + validationURL
                        }
            };
            request(reqParams, function (error, response, body) {
              if(error) {
                next(error);
                return;
              }
              // If the request to me-email hasn't failed,
              // Return a success status.
              res.send({success: true, message: 'Successfully resent validation email.'});
            }); // end request()
          }
        });
      } // end else
    }); // end db.query()
  } // end if email
});

module.exports = router;
