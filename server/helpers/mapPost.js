// module.exports = function (post) {
//     return {
//         id: post.id,
//         title: post.title,
//         imageUrl: post.imageUrl,
//         content: post.content,
//         comments: post.comments,
//         publishedAt: post.createdAt
//     }
// }

module.exports = function (post) {
    return {
        id: post.id,
        title: post.title,
        imageUrl: post.imageUrl,
        content: post.content,
      
        comments: Array.isArray(post.comments) 
            ? post.comments.map(comment => ({
                id: comment.id,        
                content: comment.content, 
                authorId: comment.authorId,
                publishedAt: comment.createdAt
            }))
            : [],
        publishedAt: post.createdAt
    }
}