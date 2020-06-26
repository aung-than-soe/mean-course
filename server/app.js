const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const path = require('path');
const userRoutes = require('./routes/authuser');
const cookieParser = require('cookie-parser');

const app = express();
let err;
const uri = "mongodb+srv://aungsoe:8j03RIwOkzhmoAm0@cluster0-wdlhm.mongodb.net/mean_course";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => console.log('Connected To Database'))
.catch(err => {
    console.log('Connection failed!', err);
    err = err;
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/images', express.static(path.join("server/images")));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "*");
    res.setHeader("Access-Control-Allow-Methods", "*")
    next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
module.exports = app;
