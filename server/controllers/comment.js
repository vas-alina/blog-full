
const Comment = require('../models/Comment');
const User = require('../models/User');

//add
async function addComment(postId, comment, authorId) {
    const newComment = await Comment.create({
        ...comment,
        postId: postId,
        author: authorId
    });
    const authorComment = await Comment.findByPk(newComment.id, {
        include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'login']
        }]
    });
      return authorComment;
}
//delete
async function deleteComment(postId, commentId) {
    const deletedCount = await Comment.destroy({
        where: {
            id: commentId,
            postId: postId 
        }
    });

    if (deletedCount > 0) {
        await Post.decrement('commentsCount', { where: { id: postId } });
    }

    return deletedCount > 0;
}


module.exports ={
    addComment,
    deleteComment
}