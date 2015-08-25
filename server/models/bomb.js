var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	name:String,
	created:{type: Date, default: Date.now },
	score:0,
	bombs:[{
		lat:Number,
		lon:Number
	}]
});
mongoose.model('User',UserSchema);