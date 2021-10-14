'use strict';
//Modules and files 
const router = require('express').Router();
const {check} = require('express-validator');
const {login}=require('../controllers/auth');
const { fieldValidation}=require('../middlewares/fields-validation');

//Login path with middleware for field validation if empty
router.post('/',
[
    check('user','El user es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio').not().isEmpty(),
    fieldValidation
],
login
);

module.exports=router;