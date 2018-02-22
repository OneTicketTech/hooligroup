const mongoose = require('../db/mongoose')

var groupSchema = mongoose.Schema({
	name: String,
	type: String,
	description: String,
	members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	create_time: Date,
	events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
})

var Group = mongoose.model('Group', groupSchema)

module.exports = Group