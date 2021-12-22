'use strict';
//Modules and files
const {check} = require('express-validator');
const {validationJWT} = require('../middlewares/validateJWT');
const router = require('express').Router();
const {getProjects,getProjectsAll,createProject,deleteProject,editProject,getProject,projectDashboard,completeProject} = require("../controllers/project");
const{fieldValidation} = require('../middlewares/fields-validation');

//POST user with middlewares
router.post('/create-project', 
[
    validationJWT,
    check('name','El nombre del provedor es obligatorio').not().isEmpty(),
    check('client','El nombre del provedor es obligatorio').not().isEmpty(),
    fieldValidation
    
]
, createProject ,async (req, res) => {
   
});

router.get('/get-projects',validationJWT,getProjects);
router.get('/projectsDashboard',validationJWT,projectDashboard);
router.get('/get-project/:id',
validationJWT,
getProject
);
router.get('/get-projectsAll',validationJWT,getProjectsAll);

router.put('/completeProject/:id',
validationJWT,
completeProject
);

router.delete('/delete-project/:id',
validationJWT,
deleteProject
);
router.put('/edit-project/:id',
validationJWT,[
check('name','El nombre del provedor es obligatorio').not().isEmpty(),
check('client','El nombre del provedor es obligatorio').not().isEmpty(),
fieldValidation],
editProject
);


module.exports = router;
