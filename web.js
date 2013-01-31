var express = require('express');
var request = require('request');
var mysql   = require('mysql');
var app = express.createServer(express.logger());

app.get('/', function(request, response) {
    //response.send('Hello ');
    
    
//    var redis  = require('redis-url').connect(process.env.REDISTOGO_URL);
//    redis.set('firstname', 'Richard');
//    redis.get('firstname', function(e,v){
//       response.send("Hello "+v);
//    });

    var connection = mysql.createConnection({
      host     : '216.145.5.210',
      user     : 'vdb',
      password : 'Password1',
      database : 'virtuoso_technology',
      insecureAuth: false
    });
    
    connection.connect();
    
    connection.query('SELECT * from daily_quotes', function(err, rows, fields) {
      if (err) throw err;
     //response.send('Hello ');
      //console.log("Ok");
      var json = JSON.stringify(rows);
      response.send(json);
    });
    
    connection.end();
});



var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});    
