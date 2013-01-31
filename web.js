var express = require('express');
var request = require('request');
var mysql   = require('mysql');
var less    = require('less');
var fs = require("fs");
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
        styles: ['css/reset.css','css/main.less']  
    },
    pretty: true 
});

app.get("*.less", function(req, res) {
    var path = __dirname + req.url;
    fs.readFile(path, "utf8", function(err, data) {
    if (err) throw err;
    less.render(data, function(err, css) {
            if (err) throw err;
            res.header("Content-type", "text/css");
            res.send(css);
    });
    });
});

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
