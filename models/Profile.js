const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    info: String,
    bio: String,
    gender: String,
    dob: String,
    work: [{ position: String, company: String }],
    education: [{ course: String, institution: String }],
    relationship: String,
    updated: {
        type: Boolean,
        default: false
    },
    country: String,
    state: String,
    zipCode: String,
    city: String,
    fcity: String,
    fstate: String,
    imageId: String
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
