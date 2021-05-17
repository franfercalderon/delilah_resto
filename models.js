const connect = require ('./connect');
const sequelize = connect.sequelize;
const { DataTypes, Model } = require('sequelize');
const { database } = require('./config');

class User extends Model {}

User.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: DataTypes.STRING,
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
},  {
    sequelize,
    modelName: 'User'
});

