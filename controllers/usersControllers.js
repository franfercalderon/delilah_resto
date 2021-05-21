const express = require('express');
const { User } = require('../models');
const router = express.Router();
const models = require ('../models');
const {loginValidation, signupValidation, jwtValidation} = require('../middlewares');

//CREACION DE NUEVO USUARIO

router.post('/', signupValidation, async (req, res)=>{
        const {userName, fullName, email, phone, adress, password, isAdmin} = req.body;
        const newUser={
            userName,
            fullName,
            email,
            phone,
            adress,
            password,
            isAdmin
        }
        const user = await User.create(newUser);
        if(user) return res.status(200).json({message:'User created!'})
        res.status(400).json({message:'Unable to create new user'})   
    })

    //LOGIN 

    .post('/login',loginValidation, async (req, res)=>{
        res.status(200).json({
            sucess:{
                token: req.token,
                userData: req.userData
            }
        })
    })

    //OBTENER LISTADO DE TODOS LOS USUARIOS (SOLO ADMIN)

    .get('/', jwtValidation, async (req, res)=>{
        if (req.userData.admin == false){
            res.send('Denied. You are no authorized');
            return
        }
        const usersList= await models.User.findAll();
        if(usersList.length>0) return res.status(200).json(usersList);
        res.status(400).json({message:'User list not found.'})
    })

    //OBTENER USER POR USERNAME, SOLO ADMIN PUEDE CONSULTAR OTROS USUARIOS. UN USUARIO PUEDE CONSULTAR SOLO POR SI MISMO

    .get ('/:username', jwtValidation, async (req, res)=>{
        const searchedUser= req.params.username;
        if (req.userData.user == searchedUser){
            const selfUser= await models.User.findOne({
                where:{userName: searchedUser} 
            });
            res.status(200).json(selfUser)
        }
        else{
            if(req.userData.admin== true){
                const selfUser= await models.User.findOne({
                    where:{userName: searchedUser} 
                });
                res.status(200).json(selfUser)
            }
            else return res.send(`Denied. You are no authorized to see "${searchedUser}" user.`);
        }
    })

    //MODIFICA USUARIO. ADMIN PUEDE MODIFICAR TODOS LOS USUARIOS, NOT ADMIN SOLO A SI MISMO. 

    .put('/:username', jwtValidation, async (req, res)=>{
        const searchedUser= req.params.username;
        if(req.userData.user == searchedUser){
            const updatedUser= await models.User.update(req.body, {
                where: {userName : searchedUser}
            })
            if(updatedUser>0) return res.status(200).json({message: 'Updated successfully'})
            res.status(400).json({message:`User "${searchedUser}" not found`})
        } 
        else{
            if(req.userData.admin == true){
                const updatedUser= await models.User.update(req.body, {
                    where: {userName : searchedUser}
                })
                if(updatedUser>0){
                    return res.status(200).json({message: 'Updated successfully'})
                }
                else{
                    res.status(400).json({message:`User "${searchedUser}" not found`}) 
                }
            }
            else return res.status(401).json({message:`Denied. You are no authorized to see "${searchedUser}" user.`})
        }
    })

    //BORRAR USUARIO. SOLO ADMIN

    .delete('/:username', jwtValidation, async (req, res) =>{
        const searchedUser= req.params.username;
        if(req.userData.admin==true){
            const deletedUser = await models.User.destroy({
                where: {userName: searchedUser}
            })
            if(deletedUser>0){
                return res.status(200).json({message: `User "${searchedUser}" was deleted!`})
            }
            else return res.status(400).json({message: `User "${searchedUser}" was not found!`})
        }
        else{
            return res.status(401).json({message:`Denied. You are no authorized to this operation.`})
        }
    })




module.exports= router;