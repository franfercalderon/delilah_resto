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
    userName: DataTypes.STRING,
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    adress: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
},  {
    sequelize,
    modelName: 'User'
});

class Product extends Model {}

Product.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    imgUrl: DataTypes.STRING,
    stock: DataTypes.FLOAT
},  {
    sequelize,
    modelName: 'Product'
});

class Order extends Model {}

Order.init({
    idOrder:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idUser: DataTypes.INTEGER,
    userName: DataTypes.STRING,
    payment: DataTypes.STRING,
    orderTotal: DataTypes.INTEGER,
    idStatus: DataTypes.INTEGER
},  {
    sequelize,
    modelName:'Order'
});

class OrderInfo extends Model { }

OrderInfo.init({
    idOrder: {
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idProduct: DataTypes.INTEGER,
    productQuantity: DataTypes.INTEGER,
    productPrice: DataTypes.INTEGER
},  {
    sequelize,
    modelName: 'OrderInfo'
});

class OrderStatus extends Model { }

OrderStatus.init({
    id: {
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: DataTypes.STRING,

},  {
    sequelize,
    modelName: 'OrderStatus'
});

module.exports = {User, Product, Order, OrderInfo, OrderStatus};