// import the node postres wrapper
var pg = require('pg');

var conString = "postgres://aaron:1234@localhost/playground";

var connect = function(query, cb){
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(query, function(err, result) {
      done(); // release client back to pool

      if(err) {
        cb(err);
      } else {
        cb(undefined, result);
      }
    });
  });
};

module.exports = {
  connect: connect
};