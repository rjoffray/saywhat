// Module dependencies
var express = require('express'),
    crypto = require('crypto'),
    assert = require('assert'),
    app = express.createServer(express.logger());



app.get('/', function(req, res) {
    

    
    /* ***************************************************
    rjoffray@saywhat:~/393971 (master) $ openssl enc -aes256 -k "encoding secret goes here" -P -md sha1 -a         
    salt=ED8C48E7D528D3B2                                                                                          
    key=0FF6DD60AED3434B5105BCAC5B2A6C96BC4F6B45FC67E98C4F98B3712CEA7B09                                           
    iv =F00562191C6F24A5933AB9A9B0EB06AA
    *******************************************************/
    


    var iv = new Buffer('8AViGRxvJKWTOrmpsOsGqg==', 'base64');
    var key = new Buffer("D/bdYK7TQ0tRBbysWypslrxPa0X8Z+mMT5izcSzqewk=", 'base64');
    
    var algo = "aes256";
    var plaintext   = "Damn you are good!!!!";


    var cipher = crypto.createCipheriv(algo, key.toString('binary'), iv.toString('binary'));
    var ciph = cipher.update(plaintext, 'utf8', 'base64');
    ciph += cipher.final('base64');
    //var ciph = new Buffer("q770t-Cein5Knn3FL6skn3yhWQNKQpy7wcjNbGLzgn5qKNOTMUe8VQ==", 'base64');
    var decipher = crypto.createDecipheriv(algo, key.toString('binary'), iv.toString('binary'));
    var txt = decipher.update(ciph, 'base64', 'utf8');
    txt += decipher.final('utf8');

    assert.equal(txt, plaintext, 'encryption and decryption with key and iv');
    
    var out  = "iv-base64: "+ iv.toString('base64')+"<br />";
        out += "key-base64: "+ key.toString('base64')+"<br />";
        out += "iv-hex: "+ iv.toString('hex')+"<br />";
        out += "key-hex: "+ key.toString('hex')+"<br />";
        out += "original: "+plaintext+"<br />";
        out += "encoded: "+ciph+"<br />";
        out += "decoded: "+txt+"<br />"+"<br />";
        
    var stext = new Buffer('152/XnbdFqiy5YGldi-HnN5y7nW2xkMrYGFAO7ao4uWXYOKlWPx4gkDj4GpBfl1aNHt5WkRJibcR6ShxJRCyhysFteLeASQNJX8RQe7FYy0YhHk_7nLv1X4tMuTgrJHbJOsiQZerigPlOlIIUa0KMIlQPA==','base64');
    var sdecipher = crypto.createDecipher(algo, key.toString('binary'), iv.toString('binary'));
    var stxt = sdecipher.update(stext, 'base64', 'utf8');
    out += "secret: "+stxt+"<br />"+"<br />";
        
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(out);  
        res.end();
  
  

});

// Only listen on $ node app.js
var port = process.env.PORT || 8080;
if (!module.parent) {
    app.listen(port);
    console.log("Express server listening on port %d",port );
}