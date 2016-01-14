//'use strict';
var express = require('express')//.createServer(); // 
var app = express();
var path = require("path");
var fs = require("fs");
var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

// var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Spreadsheet = require('edit-google-spreadsheet');



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


var result;
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


  socket.on('gameResults', function(data) {
    console.log('Starting spreadsheet')
    console.log('data' + data)
    console.log('data type' + typeof(data))

    Spreadsheet.load({
    debug: true,
    spreadsheetName: 'pcompass-user-results',
    worksheetName: 'Sheet1', 
    oauth2: {
      client_id: '369078590099-i42v5kb5kthbkeaf6t8600rgq3gu09io.apps.googleusercontent.com',
      client_secret: 'pv4x6MI2ywkbOWc9cCzt_JDD',
      refresh_token: '1/-PrhBVhHLsUItdNPaDKJP2O0qRCxUzrvs4ypu_yueP8'
    },
  }, function sheetReady(err, spreadsheet) {
    spreadsheet.receive(
      function(err, rows, info) {
      if(err) throw err;
      console.log("Found rows:", rows);
      nextRow = info.nextRow
    });
    setTimeout(function() {
    if(err) throw err; 
    console.log('nextRow' + nextRow);
    console.log('data' + data)
    console.log('type of nextrow' + typeof(eval(nextRow)));
    obj = '{ "' +nextRow +'" :{ "1": "'+data[0]+'" } }';
    spreadsheet.add( JSON.parse(obj));
    obj = '{ "' +nextRow +'" :{ "2": "'+data[1]+'" } }';
    spreadsheet.add( JSON.parse(obj));
    spreadsheet.send(function(err) {
      if(err) throw err;
      console.log("Update successful");
    });
  }, 3000);
});
});
});

var listener = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('PCompass app listening at http://%s:%s', host, port);
});



