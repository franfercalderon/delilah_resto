const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');

const db = require('./connect');
const models = require ('./models');
const startControllers = require ('./controllers/startControllers')
const userControllers = require('./controllers/usersControllers');
const productsControllers = require('./controllers/productsControllers');
const ordersControllers = require('./controllers/ordersControllers');

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use('/start', startControllers);
app.use('/users', userControllers);
app.use('/products', productsControllers);
app.use('/orders', ordersControllers);




db.init()
    .then(async () => {

        db.sequelize.sync({ force: false }).then(() => {
            console.log("Database connected");
        }).catch(err => {
            console.log(err);
        });

        app.set("port", process.env.PORT || 3000);
        app.listen(app.get("port"), () => {
            console.log("Server on port", app.get("port"))
        })

    }).catch((err) => {
        console.log('Error connecting with DB', err);
    });



models.Order.hasMany(models.OrderInfo)
models.OrderInfo.belongsTo(models.Order) 

models.OrderStatus.hasMany(models.Order)
models.Order.belongsTo(models.OrderStatus)
