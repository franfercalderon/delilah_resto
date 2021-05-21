require('dotenv').config();
const jwt= require ('jsonwebtoken');
const jwtKey= process.env.JWTPASSWORD;
const models = require('./models');

//VALIDACION DE CORREO ELECTRONICO

function emailValidation(email) {
    var re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,7}$/;
    return re.test(email);
};

//VALIDACION DE CONTRASEÑA

function passwordValidation(pass){
    const capitalLetter= /[A-Z]/g;
    const lowercaseLetter= /[a-z]/g;
    const numberCharacter = /[0-9]/g;
    if(pass.match(capitalLetter) && pass.match(lowercaseLetter) && pass.match(numberCharacter) && pass.length>=8){
        return true;
    }
    else{
        return false;
    }
}

//VALIDACION DE USUARIO NUEVO

const signupValidation= (req, res, next)=>{
    const {userName, fullName, email, phone, adress, password} = req.body;
    if(!userName || !fullName || !email || !phone || !adress || !password ){
        res.json({
            error: 'Information missing.'
        })
    }
    if(emailValidation(email)===false){
        res.json({
            error: 'Wrong email format.'
        })
    }
    if(isNaN(phone)){
        res.json({
            error: 'Phone must include only numbers.'
        })
    }
    if(passwordValidation(password)===false){
        res.json({
            error: 'Password must be at least 8 characters long, including at least one capital letter, and at least one number.'
        })
    }
    else{
        next();
    }
}

//VALIDACIÓN DE LOGIN

const loginValidation = async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password){
        res.status(400).json({error: 'Email and password are required'})
    };

    const allow = await userValidation(email, password);
    if (allow){
        req.token = allow.tokenCode;
        req.userData = allow.userData;
        next();
    }
    else{
        res.status(401).json({error: 'Email or password incorrect'})
    }
}

const jwtValidation = (req, res, next)=>{
    const tokenCode = req.headers.authorization.split(' ')[1];
    jwt.verify(tokenCode, jwtKey, (err, decoded)=>{
        if(err){
            res.send('Denied. You are no authorized')
        }
        req.userData = decoded;
        next();
    })
}

const userValidation = async (email, password) => {
    const selectedUser = await models.User.findOne({
        where: {email: email}
    })
    if(selectedUser){
        if (selectedUser.password == password.trim()) {
            const tokenCode = newToken(selectedUser.userName, selectedUser.isAdmin);
            const userData = {
                username: selectedUser.userName,
                isAdmin: selectedUser.isAdmin 
            };

            return {tokenCode, userData};
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}

//GENERACION DE NUEVO TOKEN

function newToken (username, isAdmin){
    const payload = {
        user: username,
        admin: isAdmin
    }
    const token = jwt.sign(payload, jwtKey);
    return token
};


//VALIDACION DATOS NUEVO PRODUCTO

const productValidation = (req, res, next) => {
    const{name, description, price, stock} = req.body;
    if (!name || !description || !price || !stock){
        res.status(400).json({
            error: 'Mandatory fields are missing'
        })
    }
    next();
}


module.exports = {loginValidation, signupValidation, jwtValidation, productValidation}