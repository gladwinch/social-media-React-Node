const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    time: String,
    content: String,
    company: String,
    picture: String,
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'likes'
    }],
    comment: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]
})

module.exports = Post = mongoose.model('posts', PostSchema)