//Modules and files
const Article = require('../models/article');
const Input = require('../models/input');
const Output = require('../models/output');
const Project= require('../models/project');


const getOutputs = async (req, res) => {
    try {
        const pagination = Number(req.query.pagination) || 0;
        const [outputs, total] = await Promise.all([
            Output.find()
                .skip(pagination)
                .limit(5)
                .populate('registerUser', 'user')
                .populate('project', 'name')
                .populate('article', 'name'),

            Output.countDocuments()
        ])

        res.json({
            status: 200,
            ok: true,
            total,
            outputs,
        })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);
    }
}


const addOutput = async (req, res) => {
    const _id = req._id;
    const newOutput = new Output({
        registerUser: _id,
        ...req.body
    });
    const quantity = newOutput.quantity
    const idArticle = newOutput.article
    const description=newOutput.description
    const project=newOutput.project
    console.log("Proyecto"+newOutput.project)
    try {

        if (quantity <= 0) {
            return res.status(400).json({
                ok: false,
                msg: `No se puede agregar una salida igual o menor a 0`
            });
        }
        const findArticleDB = await Article.findById(idArticle);
        const quantityOld = findArticleDB.quantity
        const newQuantity = quantityOld - quantity
        if (!findArticleDB) {
            return res.status(400).json({
                ok: false,
                msg: `No se existe ese id en los articulos`
            });
        }
        if (quantityOld < quantity) {
            return res.status(400).json({
                ok: false,
                msg: `No se puede descontar mas del stock`
            });
        }

        const updateArticle = await Article.findOneAndUpdate({ _id: idArticle }, { $set: { quantity: newQuantity } }, { useFindAndModify: false, new: true })
        console.log("si realizo la peticion")
        if (!updateArticle) {
            return res.status(400).json({
                ok: false,
                msg: `No se pudo actualizar la cantidad actual`
            });
        }
        
        //  const actualizacion = await Article.findOneAndUpdate({ _id: idArticle}, (err, articulosDB) => {
        //     articulosDB.quantity = newQuantity
        //     console.log("cantidad nueva"+articulosDB.quantity)
        //     articulosDB.save((err) => {
        //         console.log(err);
        //         res.status(500).json({
        //             ok: false,
        //             error: 'No se ha podido agregar la salida'
        //         });
        //     })
        // });
        console.log("si actualizo todo")
        await newOutput.save();
        
        console.log(newOutput.createdAt)

const projectData={
    article: findArticleDB.name,
    description: description,
    quantity: quantity

}
        const outputProject = await Project.findOneAndUpdate({_id:project},{$push:{outputs:projectData}},{ useFindAndModify: false, new: true })
       
        if (!outputProject) {
            return res.status(400).json({
                ok: false,
                msg: `No se pudo actualizar la cantidad actual`
            });
        }
        res.status(200).json({
            ok: true,
            newOutput,
            msg: `Se registro la salida con exito`
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            error: 'No se ha podido agregar la salida'
        });
    }
}

const getInputs = async (req, res) => {
    try {
        const pagination = Number(req.query.pagination) || 0;
        const [inputs, total] = await Promise.all([
            Input.find()
                .skip(pagination)
                .limit(5)
                .populate('registerUser', 'user')
                .populate('article', 'name'),

            Input.countDocuments()
        ])
        res.json({
            status: 200,
            ok: true,
            total,
            inputs,
        })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);
    }
}
const addInput = async (req, res) => {
    const _id = req._id;
    const newInput = new Input({
        registerUser: _id,
        ...req.body
    });
    const quantity = newInput.quantity
    const idArticle = newInput.article
    try {
        if (quantity <= 0) {
            return res.status(400).json({
                ok: false,
                msg: `No se puede agregar una entrada igual o menor a 0`
            });
        }
        const findArticleDB = await Article.findById(idArticle);
        const quantityOld = findArticleDB.quantity
        const newQuantity = quantityOld + quantity
        if (!findArticleDB) {
            return res.status(400).json({
                ok: false,
                msg: `No se existe ese id en los articulos`
            });
        }



        console.log("cantidad vieja" + quantityOld)
        console.log("cantidad nueva" + quantity)
        console.log("reusltado" + newQuantity)

        console.log("Actualizacion del articulo -----------")

        const updateArticle = await Article.findOneAndUpdate({ _id: idArticle }, { $set: { quantity: newQuantity } }, { useFindAndModify: false, new: true })
        console.log("si realizo la peticion")
        if (!updateArticle) {
            return res.status(400).json({
                ok: false,
                msg: `No se pudo actualizar la cantidad actual`
            });
        }
        //  const actualizacion = await Article.findOneAndUpdate({ _id: idArticle}, (err, articulosDB) => {
        //     articulosDB.quantity = newQuantity
        //     console.log("cantidad nueva"+articulosDB.quantity)
        //     articulosDB.save((err) => {
        //         console.log(err);
        //         res.status(500).json({
        //             ok: false,
        //             error: 'No se ha podido agregar la salida'
        //         });
        //     })
        // });
        console.log("si actualizo todo")
        await newInput.save();

        res.status(200).json({
            ok: true,
            newInput,
            msg: `Se registro la entrada con exito`
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            error: 'No se ha podido agregar la entrada'
        });
    }
}

const getGrafic = async (req, res) => {
    try {

        const [totalIn, totalOut, date] = await Promise.all([
            Input.aggregate([{
                // created_at: {
                //     $gte: ISODate("2010-04-29T00:00:00.000Z"),
                //     $lt: ISODate("2010-05-01T00:00:00.000Z")
                //     }
                $group: {
                    _id: '',
                    quantity: { $sum: '$quantity' }
                }
            }]),
            Output.aggregate([{
                $group: {
                    _id: '',
                    quantity: { $sum: '$quantity' }
                }
            }])

        ])
        res.json({
            status: 200,
            ok: true,
            totalIn,
            totalOut
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            error: 'Ocurrio un problema con el servidor'
        });
    }
}

module.exports = {
    getOutputs,
    addOutput,
    getInputs,
    addInput,
    getGrafic

}