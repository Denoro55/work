const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypt = require('crypto');

// Define collection and schema for Post

let Post = new Schema({
	title: {
		type: String
	},
	body: {
		type: String
	},
	owner: {
		type: String
	},
	date: {
		type: Date, 
		default: Date.now,
		required: [true, 'Укажите дату публикации']
	}

},{
	collection: 'Posts'
});
var userSchema = new Schema({
	name: {
		type: String,
		require: true,
		unique: true
	},
	hash: {
		type: String,
		require: true
	},
	salt:{
		type: String,
		require: true
	},
	iteration: {
		type: Number,
		require: true
	},
	created: {
		type: Date,
		default: Date.now()
	}
},{
	collection: 'DataUser'
})

var picSchema = new Schema({
	name: {
	    type: String,
	    required: [true, 'Укажите описание картинки']
	},
	picture: {
	    type: String
	},
	owner: {
	    type: String
	}
},{
	collection: 'Pictures'
});

// создание хеша пароля

userSchema.virtual('password')
	.set(function(data){
		this.salt = String(Math.random());
		this.iteration = parseInt(1+Math.random()*10);
		this.hash = this.getHash(data);
		console.log('worked');
	})
	.get(function(pass){
		return this.hash;
	})

userSchema.methods.getHash = function(pass){
	var c = crypt.createHmac('sha1',this.salt);
	for (let i = 0;i<this.iteration;i++){
		c = c.update(pass);
	}
	return c.digest('hex');
}

userSchema.methods.checkPassword = function(data){
    return this.getHash(data) === this.hash;
}

exports.Post = mongoose.model('Post', Post);
exports.User = mongoose.model('User',userSchema)
exports.Pic = mongoose.model('Pic',picSchema)