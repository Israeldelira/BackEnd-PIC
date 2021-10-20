//Modules and files
const Article = require('../models/article');
const QRCode = require('qrcode')

//<-------------GET all articles  ---------------->

const getArticles = async (req, res) => {
    try {

        //Search all users in db
        const allArticles = await Article.find()
            .populate('registerUser', 'nombre')
            .populate('category', 'name')
            .populate('providerId', 'name')
        // allArticles.date.toDateString();

        await
            res.json({
                status: 200,
                ok: true,
                allArticles,
            })
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
        if (articleDB) {
            return res.status(400).json({
                ok: false,
                msg: `El modelo de ese  ${articleDB.model}, ya existe`
            });
        }

        const dataNotQR = {
            ...body,
            registerUser: req._id,
        }

        console.log("este es el id "+req._id)
        let strQR = JSON.stringify(dataNotQR)
        const resultadoQR = await QRCode.toDataURL(strQR)
        const imageQR = await QRCode.toString(strQR, { type: 'terminal' })
        console.log(imageQR)
        console.log(resultadoQR)

        const dataWithQR = {
            ...dataNotQR,
            codeQR: resultadoQR
        }
        const newArticle = new Article(dataWithQR);

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
    console.log("este es el id  ANTES DEL TRY"+req._id)

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
       
   
        let strQRUpdate = JSON.stringify(dataArticle)
        const updateQR = await QRCode.toDataURL(strQRUpdate)
        const imageQR = await QRCode.toString(strQRUpdate, { type: 'terminal' })
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
        // await Article.findByIdAndUpdate(_id,{ status: false }, {new: true });
        await Article.findByIdAndDelete(_id);

        res.json({
            ok: true,
            msg: "Articulo eliminado con exito"
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
    deleteArticle
}