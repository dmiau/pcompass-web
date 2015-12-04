var express = require('express')//.createServer(); // 
var app = express();
var path = require("path");
var fs = require("fs");


//var app = require('express').createServer();
// var io = require('socket.io')(express);

// express.listen(80);

// express.get('/', function (req, res) {
//   res.sendfile(__dirname + '/index.html');
// });

// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });




app.get('/helloworld', function (req, res) {
  res.send('Hello World!');
});

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/googlemap.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/game',function(req,res){
  res.sendFile(path.join(__dirname+'/game.html'));
});

app.get('/builder',function(req,res){
  res.sendFile(path.join(__dirname+'/builder.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('PCompass app listening at http://%s:%s', host, port);
});