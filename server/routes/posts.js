const express = require('express');
const Post = require('../models/post');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        callback(error, "server/images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
})

router.post("", checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
    const url = req.protocol + "://" + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    post.save()
        .then(result => {
            res.status(201).json({
                message: 'Post added successfully',
                post: {
                    ...result,
                    id: result._id
                }
            });
        })
        .catch(err => {
            console.error('Error ', err);
        });

});

router.get("", (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery.then(docs => {
        fetchPosts = docs;
        return Post.estimatedDocumentCount()
    }).then(count => {
        res.status(200).json({
            message: `Posts fetch successfully!`,
            posts: fetchPosts,
            totalCount: count
        })
    }).catch(err => {
        return res.status(500).json({
            message: `Connection not available`,
            error: err.errors
        })
    })

});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: 'Post not found!'
                })
            }
        })
})

router.put("/:id", checkAuth,multer({ storage: storage }).single('image'), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get('host');
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    })
    Post.updateOne({ _id: req.params.id }, post)
        .then(result => {
            res.status(200).json({
                message: 'Post Updated Successfully!',
                imagePath: imagePath
            })
        })
})

router.delete("/:id", checkAuth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            res.status(200).json({ message: "Post Deleted!" });
        });
})

module.exports = router;