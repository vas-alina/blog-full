module.exports = function (comment) {
    return {
        content: comment.content,
        author: comment.author,
        id: comment.id,
        publishedAt: comment.createdAt
    }
}