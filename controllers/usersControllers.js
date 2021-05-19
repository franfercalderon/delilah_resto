const express = require('express');
const { User } = require('../models');
const router = express.Router();
const models = require ('../models');
const {loginValidation} = require('../middlewares');

router.post('/', async (req, res)=>{
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

    // .get('/', async (req, res)=>{
    //     console.log(req.user);
    // })

    .post('/login',loginValidation, async (req, res)=>{
        res.status(200).json({
            sucess:{
                token: req.token,
                userData: req.userData
            }
        })
    });




module.exports= router;