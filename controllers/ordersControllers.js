const express = require('express');
const { Order, OrderInfo, OrderStatus } = require('../models');
const router = express.Router();
const models = require ('../models');
const {jwtValidation} = require('../middlewares');

//CREAR NUEVA ORDEN

router.post('/', jwtValidation, async (req, res)=>{
        const {idProduct, payment, productQuantity} = req.body;
        const user = await models.User.findOne({
            where:{userName: req.userData.user}
        });
        var orderTotal = 0;
        for(let i=0; i<productQuantity.length; i++){
        
            const product = await models.Product.findOne({
                where: {id:idProduct[i]}
            })
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
                    productId: idProduct[i],
                    productQuantity: productQuantity[i],
                    productPrice: product.price
                }
                await models.OrderInfo.create(newDetail)
            }
        }
        const newOrder = {
            idUser: user.id,
            userName: user.userName,
            payment: payment,
            orderTotal: orderTotal,
            idStatus: 1
        };
        const orderPlaced = await models.Order.create(newOrder);
        if(orderPlaced) return res.status(200).json(orderPlaced);
        return res.status(400).json({message: 'Order was not created'})
    })

    //CONSULTAR TODAS LAS ORDENES (SOLO ADMIN). SI NO ES ADMIN, MUESTRA ORDENES PROPIAS DEL USUARIO

    .get('/', jwtValidation, async (req, res)=>{
        if(req.userData.admin==true){
            const allOrders = await models.Order.findAll();
            if (allOrders.length>0) return res.status(200).json(allOrders);
            return res.status(400).json({message:'No orders to show.'})
        }
        else{
            const user = await models.User.findOne({
                where:{userName: req.userData.user}
            });
            const limitedOrders = await models.Order.findAll({
                where: {userName: user.userName}
            });
            if (limitedOrders.length>0) return res.status(200).json(limitedOrders);
            return res.status(400).json({message:'No orders to show.'})
        }
    })

    //CONSULTAR ORDEN POR ID. SOLO ADMIN

    .get('/:id', jwtValidation, async (req, res)=>{
        const id= req.params.id;
        if(req.userData.admin== true){
            const searchedOrder = await models.Order.findOne({
                where: {idOrder: id}
            });
            if(searchedOrder)return res.status(200).json(searchedOrder);
            return res.status(400).json({message:`The order with id "${id}" does not exist.`})
        }
        else return res.send({message: 'Denied. You are no authorized'})
    })

    //MODIFICAR ORDEN POR ID. SI SE ENVIA SIN BODY, ACTUALIZA EL ESTADO DE LA ORDEN AL SIGUIENTE. (SOLO ADMIN)

    .put('/:id', jwtValidation, async (req, res)=>{
        if(req.userData.admin==true){
            const id = req.params.id;
            const updatedOrder = await models.Order.findOne({
                where: {idOrder: id}
            });
            const {idStatus: newStatus} = req.body;

            if(updatedOrder){
                //SI RECIBE BODY CON NUEVO STATUS:
                if(newStatus){
                    const updatedStatus = await models.Order.update(
                        {idStatus: newStatus}, {where:{idOrder: id}
                    })
                    if(updatedStatus>0){
                        return res.status(200).json({message: `Order updated to status ${newStatus}`})
                    }
                    return res.status(400).json({message: 'Order was not updated'})
                }
                //SI NO RECIBE BODY ACTUALIZA AL SIGUIENTE ESTADO HASTA COMPLETAR LA ORDEN
                else{
                    const oldStatus = updatedOrder.idStatus;
                    if(oldStatus > 4){
                        const statusDetail = await models.OrderStatus.findOne({
                            where: {id: oldStatus}
                        })
                        res.send({message:`Order is already completed: ${statusDetail.status}`})
                    }
                    else{
                        const updatedStatus = await models.Order.update(
                            {idStatus: (oldStatus+1)},
                            {where:{idOrder: id}}
                        )
                        if(updatedStatus) return res.status(200).json({message: `Order updated to status ${oldStatus+1}`})
                        return res.status(400).json({message: 'Order was not updated'})
                    }
                }
            }
            else return res.status(400).json({message: `Order with id ${id} not found`})
        }
        else return res.send({message: 'Denied. You are no authorized'})
    })

    //ELIMINAR ORDEN. SOLO ADMIN 

    .delete('/:id', jwtValidation, async (req, res)=>{
        if(req.userData.admin==true){
            const id = req.params.id;
            const deletedOrder = await models.Order.destroy({
                where:{idOrder: id}
            })
            if(deletedOrder>0){
                return res.status(200).json({message: `Order with id ${id} was deleted`})
            }
            else return res.status(400).json({message: `Order with id ${id} was not deleted`})
        }
        else return res.send({message: 'Denied. You are no authorized'})
    })

module.exports = router;
