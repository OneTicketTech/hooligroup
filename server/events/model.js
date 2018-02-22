const mongoose = require('../db/mongoose')

var eventSchema = mongoose.Schema({
	name: String,
	type: String,
	tags: [String],
	members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	location: String,
	begin_time: Date,
	end_time: Date,
	enroll_begin_time: Date,
	enroll_end_time: Date
})

var Event = mongoose.model('Event', eventSchema)

module.exports = Event