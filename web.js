var express = require('express');
var request = require('request');
var mysql   = require('mysql');
var less    = require('less');
var app = express.createServer(express.logger());

var date = new Date();

// app init
var app = express.createServer(express.logger());

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views')
app.set('view engine','jade');
app.set('view options', { 
    locals: { 
        scripts: ['js/jquery-183.js','js/jsrender.js','main.js'],
        styles: ['css/reset.less','css/main.less?t=' + date.getTime()]  
    },
    pretty: true 
});
less.render( __dirname + '/css/main.less');


app.get('/', function(request, response) {
  
    var connection = mysql.createConnection({
      host     : '216.145.5.210',
      user     : 'vdb',
      password : 'Password1',
      database : 'virtuoso_technology',
      insecureAuth: true
    });
    
    connection.connect();
    
  connection.query('SELECT * from daily_quotes', function(err, rows, fields) {
    if (err) throw err;
  
    response.render('index.jade',
      {
         title: 'What\'s said in the office  ... stays in the office', rows: rows    
      }
    );
  
  });
    
    connection.end();

});



var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});    
