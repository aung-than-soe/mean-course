const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Post title is required'] },
    content: { type: String, required: [true , 'Post Content is required'] },
    imagePath: { type: String, required: [true, "Image is requried"] }
});

module.exports = mongoose.model('Post', postSchema);