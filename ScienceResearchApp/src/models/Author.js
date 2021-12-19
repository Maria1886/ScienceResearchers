const Sequelize = require('sequelize')
const sequelize = require('../config/database');

const Author = sequelize.define(
    "author", 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        first_name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        profile_id: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        }
    },
    {
        timestamp: false,
        createdAt: false,
        updatedAt: false
    }
);

module.exports = Author;