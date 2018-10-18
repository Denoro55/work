var mongoose = require("mongoose");

require('./models/Note');

const Note = mongoose.model('Note');

// const config = require('../etc/config.json')

module.exports =  {

	setUpConnection: function(){
		mongoose.connect(`mongodb://localhost/test`);

		// mongoose.connect(`mongodb://denisor:195411den!@ds011412.mlab.com:11412/tester`);
		
		// mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`);
	},

	listNotes: function(id) {
	    return Note.find();
	},

	createNote: function(data) {
		
	    const note = new Note({
	        title: data.title,
	        text: data.text,
	        color: data.color,
	        createdAt: new Date()
	    });

	    return note.save();
	},

	deleteNote: function(id) {
	    return Note.findById(id).remove();
	}

}