require('dotenv').config();
const express = require('express');
const sequelize = require('./db')
const cookieParser = require("cookie-parser");
const mapUser = require('./helpers/mapUser')
const { register, login, getUsers, getRoles, updateUser, deleteUser } = require('./controllers/user');
const { getPosts, getPost, addPost, editPost, deletePost } = require('./controllers/post')
const authenticated = require('./middlewares/authenticated');
const hasRole = require('./middlewares/hasRole');
const ROLES = require('./constants/role');
const mapPost = require('./helpers/mapPost');
const { addComment, deleteComment } = require('./controllers/comment');
const mapComment = require('./helpers/mapComment');
const cors = require('cors');

const PORT = process.env.PORT

const app = express()

app.use(express.static('../client/dist'))

app.use(cors({
    origin: 'http://localhost:6001',
    credentials: true, 
  }));
app.use(express.json());
app.use(cookieParser());


app.post('/register', async (req, res) => {
    try {
        const { login, password } = req.body;
        const { user, token } = await register(login, password);

        res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
            .send({ error: null, user: mapUser(user) });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(400).send({ error: error.message || "Unknown error" });
    }
});
app.post('/login', async (req, res) => {
    try {
        const { login: userLogin, password } = req.body;
        const { user, token } = await login(userLogin, password);
        res.cookie('token', token, { httpOnly: true });
        res.send({ error: null, user: mapUser(user) });
    } catch (error) {
        res.status(401).send({ error: error.message || "Unknown error" });
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.send({ message: 'Logged out successfully' });
});

app.get('/posts', async (req, res) => {
    const { posts, lastPage } = await getPosts(
        req.query.search,
        req.query.limit,
        req.query.page,
    )

    res.send({ data: { lastPage, posts: posts.map(mapPost) } })
})

app.get('/posts/:id', async (req, res) => {
    const post = await getPost(req.params.id)

    res.send({ data: mapPost(post) })
})
app.use(authenticated);

app.post('/posts/:id/comments', async (req, res) => {
    const newComment = await addComment(req.params.id, {
        content: req.body.content,
        authorId: req.user.id
    })

    res.send({ data: mapComment(newComment) })
})
app.delete('/posts/:id/comments/commentId', hasRole([ROLES.ADMIN, ROLES.MODERATOR]), async (req, res) => {
    await deleteComment(
        req.params.postId,
        req.params.commentId,
    )

    res.send({ error: null })
})
app.post('/posts', hasRole([ROLES.ADMIN]), async (req, res) => {
    const newPost = await addPost({
        title: req.body.title,
        content: req.body.content,
        image: req.body.imageUrl
    })

    res.send({ data: mapPost(newPost) })
})

app.patch('/posts/:id', hasRole([ROLES.ADMIN]), async (req, res) => {
    const updatedPost = await editPost(
        req.params.id,
        {
            title: req.body.title,
            content: req.body.content,
            image: req.body.imageUrl
        })

    res.send({ data: mapPost(updatedPost) })
})

app.delete('/posts/:id', hasRole([ROLES.ADMIN]), async (req, res) => {
    await deletePost(req.params.id);

    res.send({ error: null })

})

app.get('/users', hasRole([ROLES.ADMIN]), async (req, res) => {
    const users = await getUsers()

    res.send({ data: users.map(mapUser) })
})
app.get('/users/roles', async (req, res) => {
    const roles = getRoles()

    res.send({ data: roles })
})
app.patch('/users/:id', async (req, res) => {
    const newUser = await updateUser(req.params.id, {
        role: rq.body.roleId
    })
    res.send({ data: mapUser(newUser) })
})
app.delete('/users/:id', async (req, res) => {
    await deleteUser(req.params.id)

    res.send({ error: null })
})

const start = async () => {
    try {
        await sequelize.authenticate()
            .then(() => {
                console.log('Connection to PostgreSQL has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
        await sequelize.sync()

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.log(error)
    }
}

start();