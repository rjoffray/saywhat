var express = require('express');
var mysql   = require('mysql');

var app = express.createServer(express.logger());

var date = new Date();

// app init
var app = express.createServer(express.logger());
app.configure(function() {

    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + '/views');
    app.set('view engine','jade');
    app.set('hasPerms',false);
    app.set('view options', { 
        locals: { 
            scripts: ['js/jquery-183.js','js/jsrender.js','js/main.js','js/less.js'],
            less: ['css/main.less?d='+date.getTime()],
            styles: ['css/reset.css']  
        },
        pretty: true 
    });
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

});


app.get('/', function(req, res) {
    
  
  
    // put check here for credentials
    if(req.params.username == "richard"){
      app.set('hasPerms',true);
    }
  
    if(app.get('hasPerms')){
      res.redirect('/quotes');
    }else{
      res.redirect('/login');
    }
});
app.get('/quotes', function(request, response) {
  console.log(request.params.username);
    if(app.get('hasPerms')){

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
      response.redirect('/login');
      
    }

});

app.get('/login', function(request, response) {
  console.log(request.params.username);
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





