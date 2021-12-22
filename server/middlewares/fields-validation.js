'use strict';
//Modules and files
const { response } = require('express');
const { validationResult } = require('express-validator');
const User = require("../models/users");

// validation of fields with express validator 
const fieldValidation = (req, res = response, next) => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }
    next();
}

function isImage(value, filename) {
    
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case  '.png':
                    return '.png';
                default:
                    return false;
            }
        }

// const validateUser = async user => {
//     let user = await User.findOne({ user });
//     return user ? false : true;
//   };

//Exporting functions for the use in other files
module.exports = {
    fieldValidation,
    isImage
}