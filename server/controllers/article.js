//Modules and files
const Article = require('../models/article');
const Input = require('../models/input');
const Output = require('../models/output');
const Project = require('../models/project');
const QRCode = require('qrcode')
const path = require('path');
const fs = require('fs');
const fileUp = require('express-fileupload');
const { uploadIMG } = require('../controllers/upload')
//<-------------GET all articles  ---------------->

const getArticles = async (req, res) => {
    try {
        const pagination = Number(req.query.pagination) || 0;
        const [allArticles, total] = await Promise.all([
            Article.find()
                .skip(pagination)
                .limit(5)
                .populate('registerUser', 'nombre')
                .populate('category', 'name')
                .populate('providerId', 'name'),
            Article.countDocuments()
        ])

        res.json({
            status: 200,
            ok: true,
            total,
            allArticles,
        })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);
    }
}
const dashboardStock = async (req, res) => {
    try {

        const pagination = Number(req.query.pagination) || 0;
        const [highStock,lowStock,totalHigh,totalLow] = await Promise.all([
            Article.find({ $and: [{ "levelStock": { '$regex': 'Alto' } }, { "quantity": { $lt: 10 } }] },)
                .skip(pagination)
                .limit(3)
                .populate('registerUser', 'nombre')
                .populate('category', 'name')
                .populate('providerId', 'name'),

            Article.find({ $and: [{ "levelStock": { '$regex': 'Bajo' } }, { "quantity": { $lt: 2 } }] },)
                .populate('registerUser', 'nombre')
                .populate('category', 'name')
                .populate('providerId', 'name'),

            Article.countDocuments(({ $and: [{ "levelStock": { '$regex': 'Alto' } }, { "quantity": { $lt: 10 } }] })),
            Article.countDocuments(({ $and: [{ "levelStock": { '$regex': 'Bajo' } }, { "quantity": { $lt: 2 } }] }))
        ])

        res.json({
            status: 200,
            ok: true,
            highStock,
            lowStock,
            totalHigh,
            totalLow,
        })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);
    }
}
const getArticlesAll = async (req, res) => {
    try {
        const articles = await Article.find()
        res.json({
            status: 200,
            ok: true,
            articles,
        })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);

    }
}

const getArticle = async (req, res) => {
    const _id = req.params.id;
    try {
        if (_id.match(/^[0-9a-fA-F]{24}$/)) {
            const article = await Article.findById(_id)
                .populate('registerUser', 'user')
                .populate('category', 'name')
                .populate('providerId', 'name');

            res.json({
                status: 200,
                ok: true,
                article: article,
            })
        } else {
            const articleModel = await Article.findOne({ model: _id })
                .populate('registerUser', 'user')
                .populate('category', 'name')
                .populate('providerId', 'name');

            res.json({
                status: 200,
                ok: true,
                article: articleModel,
            })
        }

    } catch (err) {

        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);
    }
}

//<-------------POST  create new user with password encryption ---------------->
const createArticle = async (req, res) => {

    const { codeQR, registerUser, ...body } = req.body;
    const articleDB = await Article.findOne({ model: body.model });
    try {
        let imagen = "sola";
        if (articleDB) {
            return res.status(400).json({
                ok: false,
                msg: `El modelo:  ${articleDB.model}, ya existe`
            });
        }
        if (req.files) {

            const img = req.files.img
            if (img !== "") {
                imagen = await uploadIMG(img)
            }
        } else {
            const imagen = "sola"
        }

        console.log("resultado" + imagen)

        //Generar el qr con datos del articulo

        // const dataNotQR = {
        //     ...body,
        //     img:imagen,
        //     registerUser: req._id,
        // }
        console.log("si manda el modelo" + body.model)
        const urlArticulo = `http://192.168.3.22:4200/dashboard/salidas/${body.model}`


        // const dataNotQR = {
        //     urlArticulo
        // //   model:body.model
        // }


        console.log("este es el id  " + req._id)
        // let strQR = JSON.stringify(dataNotQR)
        const resultadoQR = await QRCode.toDataURL(urlArticulo)
        const imageQR = await QRCode.toString(urlArticulo, { type: 'terminal' })
        console.log(imageQR)
        console.log(resultadoQR)

        const dataWithQR = {

            ...body,
            img: imagen,
            codeQR: resultadoQR,
            registerUser: req._id,
        }

        const newArticle = new Article(dataWithQR);
        console.log("ME IMPORTA ESTA INFO" + newArticle)

        await newArticle.save();

        res.status(201).json(newArticle);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            error: 'No se ha podido registrar el articulo'
        });

    }
}

//<-------------------PUT edit user  --------------------------------->
const editArticle = async (req, res) => {

    const _idArticle = req.params.id;


    try {

        const findArticleDB = await Article.findById(_idArticle);
        if (!findArticleDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el articulo con ese id'
            });
        }
        //Includes all values ​​except those before 3 points
        const {
            model,
            codeQR,
            ...dataArticle } = req.body;


        //validation of if exist user before modify
        if (findArticleDB.model !== req.body.model) {

            const validationArticle = await Article.findOne({ model });
            if (validationArticle) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El modelo de ese articulo ya esta registrado'
                });
            }
        }

        dataArticle.model = model;
        const urlArticuloEdit = `http://192.168.1.88:4200/dashboard/salidas/${dataArticle.model}`

        const updateQR = await QRCode.toDataURL(urlArticuloEdit)
        const imageQR = await QRCode.toString(urlArticuloEdit, { type: 'terminal' })
        // let strQRUpdate = JSON.stringify(urlArticuloEdit)
        // const updateQR = await QRCode.toDataURL(strQRUpdate)
        // const imageQR = await QRCode.toString(strQRUpdate, { type: 'terminal' })
        console.log(imageQR)

        dataArticle.codeQR = updateQR;

        const articleUpdate = await Article.findByIdAndUpdate(_idArticle, dataArticle, { new: true });

        res.json({
            ok: true,
            user: articleUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido actualizar el articulo'
        })
    }
}

//<-------------DELETE delete user in the database----------------->
const deleteArticle = async (req, res) => {
    const _id = req.params.id;

    try {
        const findArticleDB = await Article.findById(_id);
        if (!findArticleDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el articulo con ese id'
            });
        }
        const searchOutput = await Output.findOne({ article: _id })
        if (searchOutput) {
            console.log("encontrado" + JSON.stringify(searchOutput));
            const [deleteProject, deleteOutput] = await Promise.all([
                Project.deleteOne({ "outputs": searchOutput._id }),
                Output.findByIdAndDelete(searchOutput._id),
            ])
        }
        const searchInput = await Input.findOne({article: _id})
        if(searchInput ){
            const deleteInput = await Input.deleteOne({ "article": _id })
        }

        // const [deleteOutput, deleteInput, deleteArticle] = await Promise.all([

        //     await Input.deleteOne({ "article": _id }),
        const deleteArticle = await Article.findByIdAndDelete(_id)

        // ])
       
        // await Article.findByIdAndUpdate(_id,{ status: false }, {new: true });
        // await Article.findByIdAndDelete(_id);

        res.status(200).json({
            ok: true,
            msg: "Articulo eliminado con exito",
            deleteArticle
           
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'El articulo no ha podido ser eliminado'
        })
    }
}
//Exporting functions for the use in other files
module.exports = {
    getArticles,
    createArticle,
    editArticle,
    deleteArticle,
    getArticle,
    getArticlesAll,
    dashboardStock
}