
const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(result => {
            res.status(201).json({
                message: `user created!`,
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    message: err.errors['email'].message
                }
            })
        })
    })
});

router.post('/login', (req, res, next) => {
    let dbUser;
    User.findOne({ email: req.body.email })
    .then(user => {
        if(!user) {
            return res.status(401).json({
                message: `no user is registered with the email ${req.body.email}`
            });
        }
        dbUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        if(!result) {
            return res.status(401).json({
                message: `email or password is incorrect!`
            })
        }
        const token = jwt.sign({ email: dbUser.email, userId: dbUser._id }, 'mean_course_practise', {
            expiresIn: '10',
            algorithm: 'HS512'
        });
        const refresh_tk = jwt.sign({email: dbUser.email}, 'refresh_token_key', {
            algorithm: 'HS256',
            expiresIn: '3hr'
        });
        res.set('refresh_token', JSON.stringify(refresh_tk));
        res.status(200).json({
            token: token
        })
    })
    .catch(err => {
        return res.status(500).json({
            error: err.errors
        })
    });
})
module.exports = router;