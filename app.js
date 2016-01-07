var express = require('express')//.createServer(); // 
var app = express();
var path = require("path");
var fs = require("fs");

// var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/googlemap.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/game',function(req,res){
  res.sendFile(path.join(__dirname+'/game.html'));
});

app.get('/gameauthor',function(req,res){
  res.sendFile(path.join(__dirname+'/gameauthor.html'));
});

app.get('/builder',function(req,res){
  res.sendFile(path.join(__dirname+'/builder.html'));
});

app.get('/demo',function(req,res){
  res.sendFile(path.join(__dirname+'/demo.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
  socket.on('POIs', function (data) {
    console.log(data);
    var writePath = __dirname + '/data.json';
    fs.writeFile(writePath, JSON.stringify(data), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
	}); 

  });

  socket.on('authorGame', function (data) {
    console.log(data);
    var writePath = __dirname + '/game.json';
    fs.writeFile(writePath, JSON.stringify(data), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("game has been created!");
  }); 
  });
});

var listener = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('PCompass app listening at http://%s:%s', host, port);
});
