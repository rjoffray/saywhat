var express = require('express');
var request = require('request');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
    //response.send('Hello ');
    
    
//    var redis  = require('redis-url').connect(process.env.REDISTOGO_URL);
//    redis.set('firstname', 'Richard');
//    redis.get('firstname', function(e,v){
//       response.send("Hello "+v);
//    });
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : '216.145.5.210',
      user     : 'vdb',
      password : 'Password1',
      database : 'virtuoso_technology'
    });
    
    connection.connect();
    
    connection.query('SELECT * from dailey_quotes', function(err, rows, fields) {
      if (err) throw err;
    
      console.log(rows);
    });
    
    connection.end();
});



var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});    
