// const { verify } = require("../helpers/token")
// const User = require("../models/User")

// module.exports = async function (req, res, next) {
//     try {
//         const token = req.cookies.token
//         const tokenData = verify(token)

//         const user = await User.findOne({ where: { id: tokenData.id } });
//         if (!user) {
//             res.send('Authenticated user is not found')
//             return;
//         }

//         req.user = user;

//         next(); 
//     } catch (error) {
//         return res.status(401).send({ error: 'проверь токен' });
//     }

// }
const { verifyToken } = require('../helpers/token');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send({ error: 'Токен отсутствует' });
        }

        const decoded = verifyToken(token);
        const user = await User.findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).send({ error: 'Пользователь не найден' });
        }

        req.user = user; // Передаём пользователя в следующий middleware
        next();
    } catch (error) {
        console.error('Authorization error:', error.message);
        return res.status(401).send({ error: 'Неверный токен' });
    }
};
