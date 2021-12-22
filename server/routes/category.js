'use strict';
//Modules and files
const {check} = require('express-validator');
const {validationJWT,validationAdmin} = require('../middlewares/validateJWT');
const router = require('express').Router();
const {createCategory,getCategorys,editCategory,deleteCategory,getCategorysAll} = require("../controllers/category");
const{fieldValidation} = require('../middlewares/fields-validation');

//POST user with middlewares
router.post('/create-category', 
[
    validationJWT,
    validationAdmin,
    check('name','El nombre de la categoria es obligatorio').not().isEmpty(),
    fieldValidation
    
]
, createCategory ,async (req, res) => {
   
});
//GET users with middlewares
router.get('/get-categorys',validationJWT,getCategorys);
router.get('/get-categorysAll',validationJWT,getCategorysAll);
//PUT user with middlewares
router.put('/edit-category/:id',
[validationAdmin,validationJWT],
[],
editCategory
);

//DELETE USER with middlewares
router.delete('/delete-category/:id',
validationJWT,
validationAdmin,
deleteCategory
);


module.exports = router;