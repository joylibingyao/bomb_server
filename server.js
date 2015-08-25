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
var bomb = 0 

var arr = []
var bombloc = {lat: 37.377063618076384, lon: -121.91212448302834
}


// 1 * Math.acos(
//         Math.sin(latitude1) * Math.sin(latitude2)
//         + Math.cos(latitude1) * Math.cos(latitude2) * Math.cos(longitude2 - longitude1));



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
        console.log(javascriptVotes);
    io.sockets.emit("update_javascript", {
            javascriptVotes: javascriptVotes
        });
    });

    socket.on("swift", function(data) {
        console.log("a vote for swift");
        swiftVotes += 1
        console.log(swiftVotes);
        io.sockets.emit("update_swift", {
            swiftVotes: swiftVotes
        });
    });

	socket.on("bomb", function(data) {
        console.log("bomb2");
        x = data.x
        y = data.y
        console.log(x,y);
        io.sockets.emit("bomb", {
            x: x, y: y
        });
	
		var distance
		var ho=Math.pow((x-bombloc.lat),2)
		var ver= Math.pow((y-bombloc.lon),2)
		distance = Math.sqrt(ho+ver)
		console.log(distance)
		if (distance < 0.00007) {
			bomb = true
			console.log("U r bombed")
		};
    });

});