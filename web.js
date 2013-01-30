var express = require('express');
var request = require('request');
var crypt = require('crypto');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  //response.send('Hello ');


   var secret = crypto.randomBytes(16)
  , source = crypto.randomBytes(16)
  , cipher = crypto.createCipheriv("aes128", secret, secret); // or createCipher
  , decipher = crypto.createDecipheriv("aes128", secret, secret);

  cipher.setAutoPadding(false);
  decipher.setAutoPadding(false);

  var step = cipher.update(source);
  var end = decipher.update(step);

  assert.strictEqual(source.toString('binary'), end); // does not fail

});



var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});    
