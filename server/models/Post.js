const { DataTypes } = require('sequelize');
const validator = require('validator');
const sequelize = require('../db');

const Post = sequelize.define('post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        validate: {
            isValidUrl(value) {
                if (!validator.isURL(value)) {
                    throw new Error('Image should be a valid URL');
                }
            }
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, { timestamps: true });

const Comment = require('./Comment');

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

module.exports = Post;