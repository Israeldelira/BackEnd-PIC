'use strict';
//Modules and files
const {check} = require('express-validator');
const {validationJWT,validationAdmin,validationSameUser} = require('../middlewares/validateJWT');
const router = require('express').Router();
const {createUser,getUsers,editUser,deleteUser,getUsersAll} = require("../controllers/users");
const{fieldValidation} = require('../middlewares/fields-validation');


//POST user with middlewares
router.post('/create-users', [
  check('nombre','El nombre es obligatorio').not().isEmpty(),
  check('user','El user es obligatorio').not().isEmpty(),
  check('password','El password es obligatorio').not().isEmpty(),
  check('password2','La confirmacion del password es obligatorio').not().isEmpty(),
  fieldValidation
]
,createUser ,async (req, res) => {
   
});
//GET users with middlewares
router.get('/get-users',validationJWT,getUsers);
router.get('/get-usersAll',validationJWT,getUsersAll);
//PUT user with middlewares
router.put('/edit-user/:id',
[
  validationSameUser,
  validationJWT,
  check('nombre','El nombre es obligatorio').not().isEmpty(),
  check('user','El user es obligatorio').not().isEmpty(),
  check('role','El role es obligatorio').not().isEmpty(),
  fieldValidation
],
editUser
);

//DELETE USER with middlewares
router.delete('/delete-user/:id',
validationJWT,
validationAdmin,
deleteUser
);


module.exports = router;