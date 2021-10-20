const User = require('../models/users.js');
const Article = require('../models/article');
const Provider = require('../models/provider');
const Category = require('../models/category');
const Project = require('../models/project');

// search all

const getAll = async (req, res) => {
    const data = req.params.searchData;
    const regex = new RegExp(data, 'i');
    const [searchUser, searchArticle, searchProvider, searchCategory] = await Promise.all([
        Article.find({
            $or: [
                { name: regex },
                { model: regex },
                { trademark: regex },
            ]
        }),
        User.find({
            $or: [
                { nombre: regex },
                { user: regex }
            ]
        },'nombre user role status'),
        Provider.find({ name: regex }),
        Category.find({ name: regex }),
    ]);

    res.json({
        ok: true,
        msg: 'Busqueda',
        searchUser,
        searchArticle,
        searchProvider,
        searchCategory
    })

}
const getCollectionAll = async (req, res = response) => {

    const data = req.params.searchData;
    const regex = new RegExp(data, 'i');
    const table = req.params.table;
    let result = [];

    switch (table) {
        case 'user':

            result = await User.find({
                $or: [
                    { nombre: regex },
                    { user: regex }
                ]
            },'nombre user role status');
            break;
        case 'article':
            result = await Article.find({
                $or: [
                    { name: regex },
                    { model: regex },
                    { trademark: regex },
                ]
            }).populate('registerUser', 'nombre', 'user')
                .populate('category', 'name')
                .populate('providerId', 'name');

            break;

        case 'provider':

            result = await Provider.find({ name: regex })
                .populate('registerUser', 'nombre');;
            break;

        case 'category':

            result = await Category.find({ name: regex });
            break;

        default: 
        return res.status(400).json({
            ok: false,
            msg: 'Se requiere una seccion para poder continuar la busqueda usuario/categoria/provedor/articulo'
        })
    }

    res.json({
        ok: true,
        msg: 'Busqueda',
        resultado: result
    })

}
module.exports = {
    getAll,
    getCollectionAll
}
