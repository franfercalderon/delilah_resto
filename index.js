const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');

// const db= require(/)
const userControllers = require('./controllers/usersControllers');
const productsControllers = require('./controllers/productsControllers');
const ordersControllers = require('./controllers/ordersControllers');

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use('/users', userControllers);
app.use('/products', productsControllers);
app.use('/orders', ordersControllers);

