const express = require('express')
const router = express.Router()
const passport = require('passport')
const {MongoClient, ObjectId} = require('mongodb')
const upload = require('../../config/imageUpload')
const mongoURL = require('../../config/keys_dev').mongoURI
const Post = require('../../models/Post')
const Like = require('../../models/Like')
const Comment = require('../../models/Comment')


// @route         POST/api/posts/add/post
// @description   Create Post 
// @access        PRIVATE
router.post(
    '/add/post',
    passport.authenticate('jwt', { session: false }),
    upload.single('file'),
    (req, res) => {
    
    let post = new Post({
        ...req.body,
        user: req.user.id
    })

    post.save()
    .then(response => {
        res.json(response)
    })
})

//@route          POST/api/posts/image
//@description    upload image and get ID
//access          PRIVATE
router.post('/image',
passport.authenticate('jwt', { session: false }),
upload.single('file'),
(req, res) => {
    res.json({fileId: req.file.id})
})


//@route          POST/api/posts/getposts
//@description    Get All post 
//access          PRIVATE
router.get('/getposts',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        Post.find()
        .populate({
            path: 'user'
        })
        .populate({
            path: "likes"
        })
        .populate({
            path: 'comment'
        })
        .then(response => {
            res.json(response)
        })
    })


//@route          GET/api/posts/getImage
//@description    Get image 
//access          PRIVATE
router.get("/getimage/:id", (req, res) => {
    MongoClient.connect(mongoURL,
    {useNewUrlParser: true},
    (err, db) => {
        if (err) {
            return console.log("Unable to connect to Mongodb Server")
        }

        console.log("connecteed.. to database")

        db.collection('uploads.chunks')
            .find({
                files_id: ObjectId(req.params.id)
            })
            .toArray()
            .then((docs) => {
                res.json(docs)
            }, (err) => {
                res.json({Msg: "Unable to find the document"})
            })
    })
})


//@route          POST/api/posts/post/comment/:id
//@description    Add Comment to the post 
//access          PRIVATE
router.post('/post/comment/:id',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        Post.findById(req.params.id, (err, docs) => {
            if (err) {
                return res.status(404).json(err)
            }
            let newComment = new Comment({
                comment: req.body.comment,
                name: req.user.name,
                postid: req.body.id,
                user: req.user.id
            })

            newComment.save()

            docs.comment.unshift(newComment)
            docs.save()
        })
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            res.status(400).json(err)
        })
    })




//@route          POST/api/posts/post/like/:id
//@description    Add Like to the post 
//access          PRIVATE
router.post('/post/like/:id',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
      Post.findById(req.params.id)
        .populate('likes')
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'User already liked this post' });
          }

          let myLike = new Like({
              user: req.user.id,
              name: req.user.name,
              postId: req.params.id
          })
          
          myLike.save()
          // Add user id to likes array
          post.likes.unshift(myLike);

          console.log("wddfdnf dln l nle n-------------------len l")
          post.save().then(post => res.json(myLike));
          console.log("wddfdnf dln l nle nl===============+++++====en l")


        })
        .catch(err => res.status(404).json({error: "some error...", e: err}))
})


//@route          POST/api/posts/delete/like/:id
//@description    delete Like to the post 
//access          PRIVATE
router.post('/delete/like/:id',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
       Like.findOneAndDelete({_id: req.params.id})
        .then(response => {
            Like.find({})
                .then(resp => {
                    res.json(resp)
                })
        })
        .catch(err => {
            res.status(400).json(err)
        })
    
    })


//@route          GET/api/posts/get/comments
//@description    Get comments 
//access          PRIVATE
router.get('/get/comments',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        Comment.find({})
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            res.status(400).json(err)
        })
    })


//@route          GET/api/posts/get/likes
//@description    Get likes  
//access          PRIVATE
router.get('/get/likes',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        console.log("like Update")
        Like.find({})
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            res.status(400).json(err)
        })
    })

module.exports = router;