const bcrypt = require('bcryptjs');
const User = require("../models/User")
const { generate } = require('../helpers/token')
const ROLES = require('../constants/role')
//register
async function register(login, password) {
    if (!password) {
        throw new Error('Password is empty');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ login, password: passwordHash });
    const token = generate({ id: user.id })

    return { user, token };
}
//login
async function login(login, password) {
    const user = await User.findOne({ where: { login } });

    if (!user) {
        throw new Error('User is not found')
    }

    const isPassworMatch = await bcrypt.compare(password, user.password)

    if (!isPassworMatch) {
        throw new Error('Password dont match')
    }

    const token = generate({ id: user.id })

    return { token, user }
};

function getUsers() {
    return User.findAll()
}

function getRoles() {
    return [
        { id: ROLES.ADMIN, name: 'Admin' },
        { id: ROLES.MODERATOR, name: 'Moderator' },
        { id: ROLES.USER, name: 'User' }
    ]
}

//delete
async function deleteUser(id) {
    const deletedCount = await User.destroy({ where: { id } });
    return deletedCount > 0;
}
//edit(roles)
async function updateUser(id, userData) {
    const [updatedCount, [updatedUser]] = await User.update(userData, {
        where: { id },
        returning: true
    });

    return updatedCount > 0 ? updatedUser : null;
}
module.exports = {
    register,
    login,
    getUsers,
    getRoles,
    deleteUser,
    updateUser
}