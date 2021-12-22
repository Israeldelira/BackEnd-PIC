'use strict';
//Modules and files 

const fileUp = require('express-fileupload');


const router = require('express').Router();
const {check} = require('express-validator');
const {fileUpload,returnImg} = require('../controllers/upload');
const { validationJWT } = require('../middlewares/validateJWT');

router.use(fileUp());
router.put('/:type/:id',fileUpload);
router.get('/:type/:photo',returnImg);


module.exports=router;