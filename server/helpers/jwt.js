'use strict';
//Modules and files
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

//Function to generate new token with a promise 
const generateJWT = (_id) => {
    return new Promise((resolve, reject) => {
        const payload = {
            _id,
        };
        //arguments of token
        jwt.sign(payload, JWT_SECRET, {
            expiresIn: '12h',
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT Token')
            } else {
                resolve(token);
            }
        });
    });

};

//Exporting functions for the use in other files
module.exports = {
    generateJWT
}
