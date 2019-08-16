const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    name: String,
    postid: String,
    comment: String
})

module.exports = Post = mongoose.model('comments', CommentSchema)