const mongoose = require('../db/mongoose')

var commentSchema = mongoose.Schema({
	content: String,
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	likes: Number
})

var Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment