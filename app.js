var http = require('http');
var express = require('express') //.createServer(); // 
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var path = require("path");
var fs = require("fs");
var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

var Spreadsheet = require('edit-google-spreadsheet');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/templates/googlemap.html'));
});

app.get('/game', function(req, res) {
  res.sendFile(path.join(__dirname + '/templates/game.html'));
});

app.get('/gameauthor', function(req, res) {
  res.sendFile(path.join(__dirname + '/templates/gameauthor.html'));
});

app.get('/builder', function(req, res) {
  res.sendFile(path.join(__dirname + '/templates/builder.html'));
});

app.get('/demo', function(req, res) {
  res.sendFile(path.join(__dirname + '/templates/demo.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

var result;
io.on('connection', function(socket) {

  var filePath = path.join(__dirname, 'game.json');
  fs.readFile(filePath, {
    encoding: 'utf-8'
  }, function(err, data) {
    if (!err) {
      socket.emit('getGame', JSON.parse(data))
    } else {
      console.log(err);
    }
  });

  socket.on('POIs', function(data) {
    console.log(data);
    var writePath = __dirname + '/data.json';
    fs.writeFile(writePath, JSON.stringify(data), function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });

  });

  socket.on('authorGame', function(data) {
    console.log(data);
    var writePath = __dirname + '/game.json';
    fs.writeFile(writePath, JSON.stringify(data), function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("The game has been created!");
    });
  });


  socket.on('gameResults', function(data) {
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
          if (err) throw err;
          nextRow = info.nextRow
        });
      setTimeout(function() {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
          obj = '{ "' + nextRow + '" :{ "' + (i + 1) + '": "' + data[i] + '" } }';
          spreadsheet.add(JSON.parse(obj));
        }
        spreadsheet.add(JSON.parse(obj));
        spreadsheet.send(function(err) {
          if (err) throw err;
        });
      }, 3000);
    });
  });
});

var port = process.env.PORT || 3000;
var listener = server.listen(port, function() {
  var host = server.address().address;
  console.log('PCompass app listening at http://%s:%s', host, port);
});