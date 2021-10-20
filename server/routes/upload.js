'use strict';
//Modules and files 

const fileUp = require('express-fileupload');


const router = require('express').Router();
const {check} = require('express-validator');
const {fileUpload} = require('../controllers/upload');
const { validationJWT } = require('../middlewares/validateJWT');

router.use(fileUp());
router.put('/:type/:id',validationJWT,fileUpload);

module.exports=router;