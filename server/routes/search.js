'use strict';
//Modules and files 
const router = require('express').Router();
const {check} = require('express-validator');
const {getAll,getCollectionAll}=require('../controllers/search');
const { validationJWT } = require('../middlewares/validateJWT');

router.get('/:searchData',validationJWT,getAll)
router.get('/collection/:table/:searchData',validationJWT,getCollectionAll)

module.exports=router;