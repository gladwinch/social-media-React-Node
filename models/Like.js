const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LikeSchema = new Schema({
    user: String,
    name: String,
    postId: String,
})

module.exports = Like = mongoose.model('likes', LikeSchema)