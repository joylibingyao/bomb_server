var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.urlencoded());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
 res.render('index');
});

var javascriptVotes = 0
var swiftVotes = 0 

var server = app.listen(app.get('port'), function() {
  console.log('listening on port', app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  console.log('SERVER::WE ARE USING SOCKETS!');
  console.log(socket.id);

 	socket.on("javascript", function(data) {
  	console.log("a vote for javascript");
  	javascriptVotes += 1
  	io.sockets.emit("update_javascript", {
            javascriptVotes: javascriptVotes
        });

	socket.on("swift", function(data) {
  	console.log("a vote for swift");
  	swiftVotes += 1
  	io.sockets.emit("update_swift", {
            swiftVotes: swiftVotes
        });

});

// socket.on("javascript", function(data) {
//   console.log("a vote for javascript");
// });

// socket.on("swift", function(data) {
//   console.log("a vote for swift");
// });


