'use strict';
//Modules and files
const {check} = require('express-validator');
const {validationJWT} = require('../middlewares/validateJWT');
const router = require('express').Router();
const {createProvider,getProviders,editProvider,deleteProvider,getProvider,getProvidersAll} = require("../controllers/provider");
const{fieldValidation} = require('../middlewares/fields-validation');

//POST user with middlewares
router.post('/create-provider', 
[
    validationJWT,
    check('name','El nombre del provedor es obligatorio').not().isEmpty(),
    check('phone','El nombre del provedor es obligatorio').not().isEmpty(),
    fieldValidation
    
]
, createProvider ,async (req, res) => {
   
});
//GET provider with middlewares
router.get('/get-providers',validationJWT,getProviders);
router.get('/get-providersAll',validationJWT,getProvidersAll);

//GET just a one provider
router.get('/get-provider/:id',
validationJWT,
getProvider
);

//PUT user with middlewares
router.put('/edit-provider/:id',
validationJWT,
[],
editProvider
);

//DELETE USER with middlewares
router.delete('/delete-provider/:id',
validationJWT,
deleteProvider
);


module.exports = router;