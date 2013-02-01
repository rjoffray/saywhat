var express = require('express');
var mysql   = require('mysql');
var crypto = require('crypto');
var app = express.createServer(express.logger());

var date = new Date();

// app init
var app = express.createServer(express.logger());
app.configure(function() {

    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + '/views')
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
//    var data = "I am the clear text data";
//    console.log('Original cleartext: ' + data);
//    var algorithm = 'aes-128-cbc';
//    var key = 'mysecretkey';
//    var clearEncoding = 'utf8';
//    var cipherEncoding = 'hex';
//    //If the next line is uncommented, the final cleartext is wrong.
//    //cipherEncoding = 'base64';
//    var cipher = crypto.createCipher(algorithm, key);
//    var cipherChunks = [];
//    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
//    cipherChunks.push(cipher.final(cipherEncoding));
//    console.log(cipherEncoding + ' ciphertext: ' + cipherChunks.join(''));
//    var decipher = crypto.createDecipher(algorithm, key);
//    var plainChunks = [];
//    for (var i = 0;i < cipherChunks.length;i++) {
//      plainChunks.push(decipher.update(cipherChunks[i], cipherEncoding, clearEncoding));
//
//    }
//    plainChunks.push(decipher.final(clearEncoding));
//    console.log("UTF8 plaintext deciphered: " + plainChunks.join(''));
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
  console.log(request.params.username)
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
  console.log(request.params.username)
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
