//grab the packages that we need for the user model
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//user schema
var UserSchema = new Schema({
	username: {type: String, required:true, index: {unique:true}},
	fname: {type: String, required:true, index: {unique:true}},
	room: {type: String, required:true, index: {unique:true}},

	faceId: {type: String, required:false},
    password: {type: String, required:true, select: false},
});


//hash the password before the user is saved
UserSchema.pre('save', function(next){
	var user = this;

	//hash the password only if the password has been changed or user is new
	if(!user.isModified('password')) return next();

	//generate the salt
	bcrypt.hash(user.password, null, null, function(err, hash){
		if (err) return next(err);

		//change the password to the hashed version
		user.password = hash;
		next();
	});
});

//method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
};

//return the model
module.exports = mongoose.model('User', UserSchema);