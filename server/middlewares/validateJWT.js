'use strict';
//Modules and files
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

/*function to validate the token if it exists and if it 
matches the one generated by the server*/

const validationJWT = (req, res, next) => {

    const token = req.header('x-token');
    if (!token) {

        return res.status(401).json({
            ok: false,
            msg: 'El Token es requerido'
        })
    }
    try {
        const { _id } = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {

        return res.status(401).json({
            ok: false,
            msg: 'El Token no es valido'
        })

    }
}

//Exporting functions for the use in other files
module.exports = {
    validationJWT
}