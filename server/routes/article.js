'use strict';
//Modules and files
const {check} = require('express-validator');
const {validationJWT} = require('../middlewares/validateJWT');
const router = require('express').Router();
const {createArticle,getArticles,editArticle,deleteArticle} = require("../controllers/article");
const{fieldValidation} = require('../middlewares/fields-validation');

//POST user with middlewares
router.post('/create-article', 
[
    validationJWT,
    check('name','El nombre del articulo es obligatorio').not().isEmpty(),
    check('model','El modelo es obligatorio').not().isEmpty(),
    check('trademark','La marca es obligatoria').not().isEmpty(),
    check('category','La categoria no es id de mongo').isMongoId(),
    check('providerId','El provedor no es un id de mongo').isMongoId(),
    check('img','La imagen es requerida').not().isEmpty(),
    check('quantity','La cantidad es requerida').not().isEmpty(),
    fieldValidation
    
]
, createArticle ,async (req, res) => {
   
});
//GET users with middlewares
router.get('/get-articles',validationJWT,getArticles);

//PUT user with middlewares
router.put('/edit-article/:id',
[],
editArticle
);

//DELETE USER with middlewares
router.delete('/delete-article/:id',
validationJWT,
deleteArticle
);


module.exports = router;