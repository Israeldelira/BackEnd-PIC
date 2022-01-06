const User = require('../models/users.js');
const Article = require('../models/article');
const Provider = require('../models/provider');
const Category = require('../models/category');
const Project = require('../models/project');
const Output = require('../models/output');

// search all

const getAll = async (req, res) => {
    const data = req.params.searchData;
    const regex = new RegExp(data, 'i');
    const [searchUser, searchArticle, searchProvider, searchCategory, searchProject] = await Promise.all([
        User.find({
            $or: [
                { nombre: regex },
                { user: regex }
            ]},'img nombre user role status'),

        Article.find({
            $or: [
                { name: regex },
                { model: regex },
                { trademark: regex },
            ]
        }).populate('registerUser', 'nombre user')
        .populate('category', 'name')
        .populate('providerId', 'name'),
       
        Provider.find({ name: regex })
        .populate('registerUser', 'nombre'),

        Category.find({ name: regex })
        .populate('registerUser','user'),

        Project.find({  $or: [
            { name: regex },
            { client: regex },
        ]})
        .populate('registerUser','user')
        .populate('article','name')
    ]);

    res.json({
        ok: true,
        msg: 'Busqueda',
        searchUser,
        searchArticle,
        searchProvider,
        searchCategory,
        searchProject
    })

}
const getCollectionAll = async (req, res = response) => {

    const data = req.params.searchData;
    const regex = new RegExp(data, 'i');
    const table = req.params.table;
    let result = [];

    switch (table) {
        case 'users':

            result = await User.find({
                $or: [
                    { nombre: regex },
                    { user: regex }
                ]
            },'img nombre user role status');
            
            break;
        case 'articles':
            result = await Article.find({
                $or: [
                    { name: regex },
                    { model: regex },
                    { trademark: regex },
                ]
            }).populate('registerUser', 'nombre user')
                .populate('category', 'name')
                .populate('providerId', 'name');

            break;

        case 'providers':

            result = await Provider.find({ name: regex })
                .populate('registerUser', 'nombre');
            break;

        case 'categorys':

            result = await Category.find({ name: regex })
            .populate('registerUser','user');
            break;

        case 'projects':

                result = await Project.find({  $or: [
                    { name: regex },
                    { client: regex },
                ] })
                .populate('registerUser','user')
                .populate('article','name')
                break;

        case 'bajas':
            const aggregate = [
                {
                  $lookup: {
                    from: "Article",
                    localField: "article",
                    foreignField: "_id",
                    as: "article"
                  }
                },
                {
                  $unwind: "$article"
                },
                {
                  $match: {
                    "article.name": { $regex: regex }
                  }
                },
                {
                    $lookup: {
                        from: 'Project',
                        localField: 'project',
                        foreignField: '_id',
                        as: 'project'
                    }
                },
                {
                    $unwind: "$project"
                },
                {
                    $lookup: {
                        from: 'User',
                        localField: 'registerUser',
                        foreignField: '_id',
                        as: 'registerUser'
                    }
                },
                {
                    $unwind: "$registerUser"
                }
               
              ];
              
              result = await Output.aggregate(aggregate).exec();

                // result = await Output.find({})
                // .populate('registerUser','user')
                // .populate('project','name')
                // .populate({ path: 'article', match: { name: { $regex: regex } } })
                break;
                case 'inputs':
                    const aggregateInput = [
                        {
                          $lookup: {
                            from: "Article",
                            localField: "article",
                            foreignField: "_id",
                            as: "article"
                          }
                        },
                        {
                          $unwind: "$article"
                        },
                        {
                          $match: {
                            "article.name": { $regex: regex }
                          }
                        },
                        {
                            $lookup: {
                                from: 'User',
                                localField: 'registerUser',
                                foreignField: '_id',
                                as: 'registerUser'
                            }
                        },
                        {
                            $unwind: "$registerUser"
                        }
                       
                      ];
                      
                      result = await Input.aggregate(aggregateInput).exec();
        
                        // result = await Output.find({})
                        // .populate('registerUser','user')
                        // .populate('project','name')
                        // .populate({ path: 'article', match: { name: { $regex: regex } } })
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
