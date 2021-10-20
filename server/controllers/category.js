//Modules and files
const Category = require('../models/category');

//<-------------GET all articles  ---------------->

const getCategorys = async (req, res) => {
    try {

        //Search all users in db
        const allCategorys = await Category.find()
            .populate('user', 'name');
        await
            res.json({
                status: 200,
                ok: true,
                allCategorys,

            })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);
    }
}

//<-------------POST  create new user with password encryption ---------------->
const createCategory = async (req, res) => {

    const { name } = req.body;
    try {

        const validationCategory = await Category.findOne({ name });
        if (validationCategory) {
            return res.status(400).json({
                ok: false,
                msg: 'La categoria ya esta registrada'
            });
        }
        const newCategory = new Category(
            {
                name
            });
        await newCategory.save();

        res.status(200).json({
            ok: true,
            category: newCategory,
            msg: 'Categoria creada con exito'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error: 'No se ha podido registrar la categoria'
        });

    }
}

//<-------------------PUT edit user  --------------------------------->
const editCategory = async (req, res) => {

    const _id = req.params.id;

    try {

        const findCategoryDB = await Category.findById(_id);
        if (!findCategoryDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe la categoria con ese id'
            });
        }
        //Includes all values ​​except those before 3 points
        const { name, ...dataCategory } = req.body;

        //validation of if exist user before modify
        if (findCategoryDB.name !== req.body.name) {

            const validationCategory = await Category.findOne({ name });
            if (validationCategory) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La categoria ya esta registrada'
                });
            }
        }

        dataCategory.name = name;
        const categoryUpdate = await Category.findByIdAndUpdate(_id, dataCategory, { new: true });

        res.json({
            ok: true,
            user: categoryUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido actualizar la categoria'
        })
    }
}

//<-------------DELETE delete user in the database----------------->
const deleteCategory = async (req, res) => {
    const _id = req.params.id;

    try {

        //Find user by id in db
        const findCategoryDB = await Category.findById(_id);
        if (!findCategoryDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe la categoria con ese id'
            });
        }
        //Delete user by id in db

        await Category.findByIdAndDelete(_id);

        res.json({
            ok: true,
            msg: "Categoria  eliminada con exito"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido eliminar la categoria'
        })
    }
}
//Exporting functions for the use in other files
module.exports = {
    getCategorys,
    createCategory,
    editCategory,
    deleteCategory
}