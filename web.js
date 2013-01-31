var express = require('express');
var request = require('request');
var mysql   = require('mysql');
var app = express.createServer(express.logger());

var date = new Date();

// app init
var app = express.createServer(express.logger());

app.use(express.static('/public'));
app.set('views', __dirname + '/views')
app.set('view engine','jade');
app.set('view options', { 
    locals: { 
        scripts: ['js/jquery-183.js','js/jsrender.js','main.js'],
        styles: ['css/reset.css','css/main.css?t=' + date.getTime()]  
    },
    pretty: true 
});
app.get('/', function(request, response) {
    
    
    
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
      insecureAuth: true
    });
    
    connection.connect();
    

    
    connection.end();
    
    	connection.query('SELECT * from daily_quotes', function(err, rows, fields) {
		if (err) throw err;

		response.render('index.jade',{
			title:"",
			"quotes":rows
			};
	 );

		

	});
});



var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});    
