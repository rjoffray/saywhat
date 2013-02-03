// Module dependencies
var http = require('http'),
    express = require('express'),
    crypto = require('crypto');




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

};





  
var app = module.exports = express.createServer();
    //blackoutAPI = http.createClient(80, 'http://api.blackoutrugby.com');

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

app.use(express.bodyParser());

// Routes
var iv = "v4645jS75BWw8PjJmRmXYQ==";
var key = "LpAHsjmXvzsj7h84UEgRYoXV/U4viJClViRvfOOc/k8=";
app.get('/', function(req, res){
    var iv = "v4645jS75BWw8PjJmRmXYQ==";
    var key = "LpAHsjmXvzsj7h84UEgRYoXV/U4viJClViRvfOOc/k8=";
    console.log(key);
    console.log(iv);
});
app.get('/binary/:message', function(req, res){
  var result = cryptoTest(req.params.message, key, iv, 'binary');
	res.send(req.params.message + 
		' <br/><br/> ' + 
		result.encrypted + 
		' <br/><br/> ' + 
		result.decrypted + 
		' <br/><br/> ' + 
		'<a href="http://api.blackoutrugby.com/?d=19&er=' + result.encrypted + '">http://api.blackoutrugby.com/?d=19&er=' + result.encrypted + '</a>');
});

app.get('/base64/:message', function(req, res){
	var result = cryptoTest(req.params.message, 'GO8FzK17iPYKE2Kt', 'E2I51NEwsC3RdSNl', 'base64');
	res.send(req.params.message + 
		' <br/><br/> ' + 
		result.encrypted + 
		' <br/><br/> ' + 
		result.decrypted + 
		' <br/><br/> ' + 
		'<a href="http://api.blackoutrugby.com/?d=19&er=' + result.encrypted + '">http://api.blackoutrugby.com/?d=19&er=' + result.encrypted + '</a>');
});

function cryptoTest(data, key, iv, format) {
	var cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
	var cipherChunks = [];
	cipherChunks.push(cipher.update(data, 'utf8', format));
	cipherChunks.push(cipher.final());

	var decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
	var plainChunks = [];
	for (var i = 0;i < cipherChunks.length;i++) {
	  plainChunks.push(decipher.update(cipherChunks[i], format, 'utf8'));
	}
	plainChunks.push(decipher.final());

	return {
		"encrypted": Base64.encode(cipherChunks.join('')),
		"decrypted": plainChunks.join('')
	};
}

// Only listen on $ node app.js
var port = process.env.PORT || 8080;
if (!module.parent) {
    app.listen(port);
    console.log("Express server listening on port %d",port );
}