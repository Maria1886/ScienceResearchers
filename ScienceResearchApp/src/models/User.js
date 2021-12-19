const Sequelize = require('sequelize')
const sequelize = require('../config/database');

const User = sequelize.define(
    "user", 
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
        email: {
            type: Sequelize.STRING(50),
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(300),
            allowNull: false
        }
    },
    {
        timestamp: false,
        createdAt: false,
        updatedAt: false
    }
);

module.exports = User;