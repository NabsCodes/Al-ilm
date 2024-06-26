const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    photo: String,
    blogPost: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    e_readTime: Number,
    author: String,
    allowComment: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isFeature: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            user: {
                type: String
            },
            name: {
                type: String
            },
            email: {
                type: String
            },
            text: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
            likes: {
                type: Number,
                default: 0
            },
            dislikes: {
                type: Number,
                default: 0
            }
        }
    ]
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
