var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.urlencoded());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5008));

app.get('/', function(req, res) {
	    res.render('index');
});
require('./config/mongoose.js');
// Connecting with mongoose
var mongoose = require('mongoose');
var User = mongoose.model('User');


var server = app.listen(app.get('port'), function() {
	    console.log('listening on port', app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) 
{
	var user 
	var all
	User.find({}, function(err, results) {
       if(err) {
         console.log(err);
       } else {
         // res.json(results);
         all = results

       }
   })

	console.log('SERVER::WE ARE USING SOCKETS!!!!!');
	 console.log(socket.id);
	socket.on("startPressed", function(data) 
	{
		// add to dataBase
		
		console.log(data.name);
		User.find({name:data.name},function(err, results) {

			if(err) {
				console.log(err);
			} else {
				if (results.length == 0)
				{
					console.log("new");
					user = new User({name:data.name})
					io.emit("userInfo", 0)
					user.save(function(err) {

						if(err) 
						{
							console.log('something went wrong');
					    } else { // else console.log that we did well and then redirect to the root route
					    	console.log('successfully added!');
					    	
					    }
					});
				}
				else{
					user = results

					io.emit("userInfo", user[0].score)
				}
			}
		});

		// added
		io.emit("geolocation", {
			name: data.name,
			lat: data.lat,
			lon: data.lon
		})
	})

	//next event
	socket.on("dropPressed", function(data) 
	{
	console.log("bomb2",data);
	// add bomb to dataBase

	User.update( {name : data.name},{
			$inc:{score:1},
			$addToSet : { bombs : {lat:data.lat, lon:data.lon} }
		}, function(err, status){
			if(err){
				res.send(err);
			} else {
				console.log("added a bomb!!!");

						// res.json(status);
			}
		});
	// added
	User.find({name:data.name},function(err, results) {
			if(err) {
				console.log(err);
			} else {
				// console.log(results[0].score,"this is result");
				io.emit("bombAdded",results[0].score)
			}
		});

    });

	//next event
	socket.on("check", function(data) 
	{
		console.log(data,"hi");
		for (var i = 0; i < 2; i++) {
			// console.log(all[i].bombs);
			for (var j = 0; j < all[i].bombs.length; j++) {
				// console.log(all[i].bombs[j]);
				var bombloc = all[i].bombs[j]
				var distance
				var ho=Math.pow((data.lat-bombloc.lat),2)
				var ver= Math.pow((data.lon-bombloc.lon),2)
				distance = Math.sqrt(ho+ver)
				console.log(distance)

				if (distance < 0.00007) 
				{
					console.log("U r bombed")
					io.emit("getBombed","bombed")
					User.remove({_id:bombloc.id},function(err,results){
						console.log("destroyed bomb");
					})
					return true
				};
			};

		};


	})
	//next event
	socket.on("status", function(data) 
	{
		console.log(data)
		io.emit("status", {
			name: name
		})

	})	
})
