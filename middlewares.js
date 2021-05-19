require('dotenv').config();
const jwt= require ('jsonwebtoken');
const jwtKey= process.env.JWTPASSWORD;
// const tokenCode;
const models = require('./models');

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

// const jwtValidation = (req, res, next)=>{
//     const tokenCode = req.headers.authorization.split('')[1];

// }

const userValidation = async (email, password) => {
    const selectedUser = await models.User.findOne({
        where: {email: email}
    });
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

function newToken (username, isAdmin){
    console.log(username)
    const payload = {
        user: username,
        admin: isAdmin
    }
    const token = jwt.sign(payload, jwtKey);
    console.log(payload);
    console.log(token);
    console.log(jwtKey);
    return token
};

module.exports = {loginValidation}