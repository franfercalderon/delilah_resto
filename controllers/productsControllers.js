const express = require('express');
const router = express.Router();
const models = require ('../models');
const {jwtValidation, productValidation} = require('../middlewares');

//CREA NUEVO PRODUCTO. SOLO ADMIN.

router.post('/',productValidation, jwtValidation, async (req, res)=>{
        if(req.userData.admin == true){
            const{name, description, price, imgUrl, stock} = req.body;
            const newProduct= {
                name,
                description,
                price,
                imgUrl,
                stock
            }
            const uploadProduct = await models.Product.create(newProduct);
            if(uploadProduct) return res.status(200).json({message: 'Product created!'});
            res.status(400).json({message: 'Unable to create the product'})
        }
        else{
            res.send({message: 'Denied. You are no authorized'});
        }
    })

    //OBTENER LISTADO DE TOODS LOS PRODUCTOS

    .get('/', jwtValidation, async (req, res)=>{
        if(req.userData.admin == true){
            const res = 1+5/3;
            console.log(res);
            const products = await models.Product.findAll();
            if(products.length>0) return res.status(200).json(products);
            return res.status(400).json({message: 'There are no products to show'})
        }
        else return res.send({message: 'Denied. You are no authorized'})
    })

    //OBTENER PRODUCTO POR ID. SOLO ADMIN

    .get('/:id', jwtValidation, async (req, res)=>{
        if(req.userData.admin == true){
            const id= req.params.id;
            const searchedProduct = await models.Product.findOne({
                where: {id: id}
            })
            if(searchedProduct){
                return res.status(200).json(searchedProduct)
            }
            return res.status(400).json({message:'Product not found.'})
        }
        else return res.send({message: 'Denied. You are no authorized'})
    })

    //MODIFICAR PRODUCTOS. SOLO ADMIN

    .put('/:id', jwtValidation, async (req, res)=>{
        if (req.userData.admin == true){
            const id = req.params.id;
            const updatedProduct = await models.Product.update(req.body, {
                where:{id: id}
            });
            if(updatedProduct>0){
                return res.status(200).json({message: 'Updated successfully'})
            }
            else return res.status(400).json({message:`Product with id "${id}" was not found`})
        }
        else return res.status(401).json({message:`Denied. You are no authorized to edit products.`})
    })

    //ELIMINAR PRODUCTOS. SOLO ADMIN

    .delete('/:id', jwtValidation, async (req, res)=>{
        if (req.userData.admin == true){
            const id = req.params.id;
            const deleteProduct = await models.Product.destroy({
                where: {id: id}
            });
            if(deleteProduct>0)return res.status(200).json({message: `Product was deleted!`})
            return res.status(400).json({message: `Product was not found.`})
        }
        else return res.status(401).json({message:`Denied. You are no authorized to this operation.`})
    })


module.exports = router;
