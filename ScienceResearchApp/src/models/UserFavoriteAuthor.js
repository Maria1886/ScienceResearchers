const Sequelize = require('sequelize')
const sequelize = require('../config/database');

const Author = require('./Author');
const User = require('./User')

const UserFavoriteAuthor = sequelize.define(
    "favorite_author", 
    {
        userId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        authorId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
        }
    },
    {
        timestamp: false,
        createdAt: false,
        updatedAt: false
    }
);

// 1 user poate avea mai multi autori preferati
// 1 autor poate fi in lista de favorite a mai mulor useri
User.belongsToMany(Author, { through: UserFavoriteAuthor })
Author.belongsToMany(User, { through: UserFavoriteAuthor })

module.exports = UserFavoriteAuthor;