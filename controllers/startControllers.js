const express = require('express');
const { User, OrderStatus } = require('../models');
const router = express.Router();
const models = require ('../models');

//POST PARA CREAR PRODUCTOS INICIALES

router.post('/products', async(req, res)=>{
    const startProducts= [
        {
            name: 'Fetuccini alla carbonara',
            description: 'Cintas caseras con cebolla, queso parmesano y hierbas',
            price: '899',
            imgUrl: 'https://delilahresto.com/pasta/fetuccini.jpg',
            stock: '20'
        },
        {
            name: 'Gnocchi di patate',
            description: 'Gnocchi de papa y huevo',
            price: '759',
            imgUrl: 'https://delilahresto.com/pasta/gnocchi.jpg',
            stock: '15'
        },
        {
            name: 'Lasagna verde',
            description: 'Lasagna de vegetales',
            price: '599',
            imgUrl: 'https://delilahresto.com/pasta/lasagna.jpg',
            stock: '21'
        },
        {
            name: 'Spaghetti di salmone',
            description: 'Spaghetti con salsa de salmón y alcaparras',
            price: '1099',
            imgUrl: 'https://delilahresto.com/pasta/spaghetti.jpg',
            stock: '9'
        }
    ];
    startProducts.forEach(e=>{
        models.Product.create(e)
    });

    res.status(200).json({message:'Starting products created!'});

    })

    //POST PARA CREAR USUARIOS INICIALES (UNO ADMIN Y OTRO NO)

    .post('/users', async (req, res)=>{
        const startUsers=[
            {
                userName: 'franfer',
                fullName: 'Franco Fernandez',
                email: 'franco@gmail.com',
                phone: '5491130955758',
                adress: 'Calle Falsa 123 P3 Dpto A, Buenos Aires',
                password: 'Password123!',
                isAdmin: true
            },
            {
                userName: 'ojalaMeApruebe',
                fullName: 'Evaluador Bueno',
                email: 'eval@gmail.com',
                phone: '5491110987865',
                adress: 'Calle Verde 456 P3 Dpto B, Mendoza',
                password: 'Password456!',
                isAdmin: false
            }
        ];

        startUsers.forEach(e=>{
            User.create(e)
        });
        res.status(200).json({message:'Starting users created!'})
    })

    //POST PARA CREAR STATUS INICIALES (UNO ADMIN Y OTRO NO)

    .post('/status', async(req, res)=>{
        const startStatus=[
            {
                id:1,
                status:'Iniciado'
            },
            {
                id:2,
                status:'En preparación'
            },
            {
                id:3,
                status:'En entrega'
            },
            {
                id:4,
                status:'Entregado'
            },
            {
                id:5,
                status:'Finalizado exitosamente'
            },
            {
                id:6,
                status:'Cancelado'
            }
        ];
        startStatus.forEach(e=>{
            OrderStatus.create(e)
        });
        res.status(200).json({message:'Order statuses created!'})
    });



module.exports = router;