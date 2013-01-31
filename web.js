var express = require('express');
var request = require('request');
var mysql   = require('mysql');
var less    = require('less');
var fs = require("fs");
var app = express.createServer(express.logger());

var date = new Date();

// app init
var app = express.createServer(express.logger());
app.configure(function() {

    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + '/views')
    app.set('view engine','jade');
    app.set('view options', { 
        locals: { 
            scripts: ['js/jquery-183.js','js/jsrender.js','js/main.js','js/less.js'],
            less: ['css/main.less'],
            styles: ['css/reset.css']  
        },
        pretty: true 
    });
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

});





app.get('/quotes', function(request, response) {
  
    var hasPerms = true;
    if(hasPerms){
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
        console.log(JSON.stringify(rows[0]));
        response.render('index.jade',
          {
             title: 'What\'s said in the office  ... stays in the office', rows: rows    
          }
        );
      
      });
      
      connection.end();
    }else{
      app.get('/login');
      
    }

});

app.get('/login', function(request, response) {
  response.render('login.jade',
      {
         title: 'Login: What\'s said in the office  ... stays in the office'    
      }
    );
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});    
