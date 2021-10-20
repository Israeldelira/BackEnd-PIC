'use strict';
//Modules and files 
const router = require('express').Router();
const {check} = require('express-validator');
const {login,renewToken}=require('../controllers/auth');
const {validationJWT} = require('../middlewares/validateJWT');



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

router.get('/renew',validationJWT,renewToken);

module.exports=router;