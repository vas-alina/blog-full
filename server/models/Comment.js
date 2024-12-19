const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Post = require('./Post');

const Comment = sequelize.define('comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    
});
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
module.exports = Comment;