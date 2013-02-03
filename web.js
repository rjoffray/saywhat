var express = require('express');
var mysql   = require('mysql');
var crypto = require('crypto');
var assert = require('assert');
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


var iv = "1234567812345678";
var key = "0123456789abcd012345678901234567";

var algo = "aes256";
var plaintext   = "Damn you are good!!!!";


  var cipher = crypto.createCipheriv(algo, key, iv);
  var ciph = cipher.update(plaintext, 'utf8', 'base64');
  ciph += cipher.final('base64');

  var decipher = crypto.createDecipheriv(algo, key, iv);
  var txt = decipher.update(ciph, 'base64', 'utf8');
  txt += decipher.final('utf8');

  assert.equal(txt, plaintext, 'encryption and decryption with key and iv');

console.log(txt);
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




var Base64 = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Base64._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

}
