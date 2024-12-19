const { Op } = require('sequelize');
const Post = require('../models/Post')
const Comment = require('../models/Comment')
//add
function addPost(post) {
    return Post.create(post, {
        include: [{
            model: Comment,
            as: 'comments'
        }]
    })
}
//edit
async function editPost(id, post) {
    const [updatedCount, [updatedPost]] = await Post.update(post, {
        where: { id },
        returning: true 
    });

    if (updatedCount === 0) {
        return null
    }
    if (post.comments && Array.isArray(post.comments)) {
        await Promise.all(
            post.comments.map(comment => {
                return Comment.update(comment, {
                    where: { id: comment.id },
                    returning: true
                });
            })
        );
    }
    return updatedPost; 

}
//delete
async function deletePost(id) {
    const deletedCount = await Post.destroy({ where: { id } }); 
    return deletedCount > 0;
}
//get list with search and pagination
async function getPosts(search = '', limit = 10, page = 1) {
    const offset = (page - 1) * limit;
    const { count, rows: posts } = await Post.findAndCountAll({
        where: {
            title: {
                [Op.like]: `%${search}%`
            }
        },
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
    })
    return {
        posts,
        lastPage: Math.ceil(count / limit),
    }
}
//get item
function getPost(id) {
    return Post.findByPk(id, {
        include: [{
            model: Comment,
            as: 'comments'
        }]
    });
}

module.exports = {
    addPost,
    deletePost,
    editPost,
    getPost,
    getPosts,
}