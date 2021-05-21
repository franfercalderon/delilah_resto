const express = require('express');
const { Order, OrderInfo, OrderStatus } = require('../models');
const router = express.Router();
const models = require ('../models');
const {jwtValidation} = require('../middlewares');



router.post('/', jwtValidation, async (req, res)=>{
        const {idProduct, payment, productQuantity} = req.body;
        const user = req.userData.user;
        // const array = Array.isArray(productQuantity);
        // console.log(array)
        // if(productQuantity.length>1){
        // // if(array){
        //     var orderTotal = 0;
        //     for(let i=0; productQuantity.length<0; i++){
        //         const product = await models.Product.findOne({
        //             where: {id:idProduct[i]}
        //         })
        //         orderTotal += (product.price* productQuantity[i]);
        //         const newStock = product.stock - productQuantity[i]
        //     }
        // }
        var orderTotal = 0;
        for(let i=0; i<productQuantity.length; i++){
            // console.log(productQuantity.length);
            const product = await models.Product.findOne({
                where: {id:idProduct[i]}
            })
            // console.log(product);
            orderTotal += (product.price* productQuantity[i]);
            const newStock = product.stock - productQuantity[i];
            if(newStock<0){
                res.send('We are sorry. Order exceeds available stock, please try with less products or choose a different menu.')
            }
            else{
                await models.Product.update({stock: newStock}, {
                    where:{id: idProduct[i]}
                });
                const newDetail = {
                    productName: product.name,
                    productQuantity: productQuantity[i],
                    productPrice: product.price

                }
                await models.OrderInfo.create(newDetail)
            }
        }

    })


    // Order.init({
    //     idOrder:{
    //         type:DataTypes.INTEGER,
    //         autoIncrement: true,
    //         primaryKey: true
    //     },
    //     idUser: DataTypes.INTEGER,
    //     userName: DataTypes.STRING,
    //     payment: DataTypes.STRING,
    //     orderTotal: DataTypes.INTEGER,
    //     idStatus: DataTypes.INTEGER

    // OrderInfo.init({
    //     idOrder: {
    //         type:DataTypes.INTEGER,
    //         autoIncrement: true,
    //         primaryKey: true
    //     },
    //     productName: DataTypes.String,
    //     productQuantity: DataTypes.INTEGER,
    //     productPrice: DataTypes.INTEGER

    // Product.init({
    //     id:{
    //         type:DataTypes.INTEGER,
    //         autoIncrement: true,
    //         primaryKey: true
    //     },
    //     name: DataTypes.STRING,
    //     description: DataTypes.STRING,
    //     price: DataTypes.INTEGER,
    //     imgUrl: DataTypes.STRING,
    //     stock: DataTypes.FLOAT

module.exports = router;