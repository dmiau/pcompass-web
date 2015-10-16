var express = require('express');
var app = express();
var path = require("path");

app.get('/helloworld', function (req, res) {
  res.send('Hello World!');
});

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/googlemap.html'));
  //__dirname : It will resolve to your project folder.
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('PCompass app listening at http://%s:%s', host, port);
});