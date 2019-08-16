const express = require('express')
const router = express.Router()
const {MongoClient, ObjectId} = require('mongodb')
const passport = require('passport')
const upload = require('../../config/imageUpload')
const mongoURL = require('../../config/keys_dev').mongoURI

//Models
const User = require('../../models/User')
const Profile = require('../../models/Profile')

//Import Validator
const addCredentialValidator = require('../../validation/addCredential')

// @route         GET/api/profile
// @description   Get User Profile
// @access        PRIVATE
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const errors = {}

        Profile.findOne({ user: req.user.id })
            .populate('user', ['name'])
            .then(profile => {
                if (!profile) {
                    errors.noprofile = "There is no profile for this user"
                   return res.status(404).json(errors)
                }

                res.json(profile)
            })
            .catch(err => res.status(404).json(err))
})


//@route          POST/api/profile/image/upload
//@description    upload image and get data
//access          PRIVATE
router.post('/image',
passport.authenticate('jwt', { session: false }),
upload.single('file'),
(req, res) => {
    MongoClient.connect(mongoURL,
    {useNewUrlParser: true},
    (err, db) => {
        if (err) {
            return console.log("Unable to connect to Mongodb Server")
        }

        console.log("connecteed.. to database")

        db.collection('uploads.chunks')
            .find({
                files_id: ObjectId(req.file.id)
            })
            .toArray()
            .then((docs) => {
                res.json(docs)
            }, (err) => {
                res.json({Msg: "Unable to find the document"})
            })
    })
})


//@route          Get/api/profile/picture
//@description    GET Profile Pic
//access          PRIVATE
router.get('/my/picture/:pic_id',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        MongoClient.connect(mongoURL, {
                useNewUrlParser: true
            },
            (err, db) => {
                if (err) {
                    return console.log("Unable to connect to Mongodb Server")
                }
                console.log("connecteed.. to database")

                db.collection('uploads.chunks')
                    .find({
                        files_id: ObjectId(req.params.pic_id)
                    })
                    .toArray()
                    .then((docs) => {
                        res.json(docs)
                    }, (err) => {
                        res.json({
                            Msg: "Unable to find the document"
                        })
                    })
            })
    })

// @route         POST/api/profile/addcredential
// @description   Get User Profile
// @access        PRIVATE
router.post(
    '/addcredential',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = addCredentialValidator(req.body)

        if(!isValid) {
            return res.status(400).json(errors)
        }

        let newCredentials = new Profile({
            ...req.body,
            user: req.user.id,
            work: [{ position: req.body.position, company: req.body.company}],
            education: [{ course: req.body.course, institution: req.body.institution}],
            updated: true
        })

        
        newCredentials.save()
            .then(response => {
                res.send({Message: "Success"})
                User.findOne({_id: req.user.id}, (err, object) => {
                    object.profileUpdate = true,
                    object.profilePicId = req.body.imageId
                    object.save()
                })    
            })
            .catch(err => res.status(400).json(err))

})


//@route          POST/api/profile/image/upload
//@description    upload image and get data
//access          PRIVATE
router.get('/profile',
passport.authenticate('jwt', { session: false }),
(req, res) => {
    Profile.findOne({user: req.user.id})
        .populate('user', 'name')
        .then(response => res.send(response))
})

//@route          POST/api/profile/add/info
//@description    Update Infomation
//access          PRIVATE
router.post('/add/info',
passport.authenticate('jwt', { session: false }),
(req, res) => {
   Profile.findOneAndUpdate({user: req.user.id}, {$set:{info: req.body.info }})
        .then(response => res.json({msg: "succes"}))
        .catch(err => console.log(err))
})

//@route          POST/api/profile/add/bio
//@description    Updata Bio
//access          PRIVATE
router.post('/add/bio',
passport.authenticate('jwt', { session: false }),
(req, res) => {
   Profile.findOneAndUpdate({user: req.user.id}, {$set:{ bio: req.body.bio }})
        .then(response => res.json({msg: "succes"}))
        .catch(err => console.log(err))
})

module.exports = router;