const {validationJWT} = require('../middlewares/validateJWT');
const router = require('express').Router();
const {getOutputs,addOutput,getInputs,addInput,getGrafic} = require("../controllers/warehouse");


router.get('/get-outputs',validationJWT,getOutputs);
router.get('/get-inputs',validationJWT,getInputs);
router.post('/add-outputs',validationJWT,addOutput);
router.post('/add-inputs',validationJWT,addInput);
router.get('/get-dataGrafic',validationJWT,getGrafic);

module.exports = router;