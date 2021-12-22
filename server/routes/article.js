'use strict';
//Modules and files
const {check} = require('express-validator');
const {validationJWT,validationAdmin} = require('../middlewares/validateJWT');
const router = require('express').Router();
const {createArticle,getArticles,editArticle,deleteArticle,getArticle,getArticlesAll,dashboardStock} = require("../controllers/article");
const{fieldValidation,isImage} = require('../middlewares/fields-validation');


const fileUp= require("express-fileupload");

router.use(fileUp());
//POST user with middlewares
router.post('/create-article', 
[
    validationJWT,
    validationAdmin,
    check('name','El nombre del articulo es obligatorio').not().isEmpty(),
    check('model','El modelo es obligatorio').not().isEmpty(),
    check('trademark','La marca es obligatoria').not().isEmpty(),
    check('category','La categoria no es id de mongo').isMongoId(),
    check('providerId','El provedor no es un id de mongo').isMongoId(),
    check('quantity','La cantidad es requerida').not().isEmpty(),
    fieldValidation
    
]
, createArticle  ,async (req, res) => {
   
});
//GET users with middlewares
router.get('/get-articles',validationJWT,getArticles);
router.get('/dashboardStock',validationJWT,dashboardStock);

router.get('/get-articlesAll',validationJWT,getArticlesAll);
router.get('/get-article/:id',validationJWT,validationAdmin,getArticle);
//PUT user with middlewares
router.put('/edit-article/:id',validationJWT,validationAdmin,
[],
editArticle
);

//DELETE USER with middlewares
router.delete('/delete-article/:id',
validationJWT,
validationAdmin,
deleteArticle,

);


module.exports = router;