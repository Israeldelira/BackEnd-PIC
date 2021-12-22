//Modules and files

const User = require('../models/users');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

//<-------------GET all users  ---------------->

const getUsers = async (req, res) => {
    try {
        const pagination = Number(req.query.pagination) || 0;
        console.log(pagination);
        const [usuarios, total] = await Promise.all([
            User.find({}, '_id nombre user role status img')
                .skip(pagination)
                .limit(5),

            User.countDocuments()
        ])
        res.status(200).json({
            ok: true,
            usuarios,
            total
        });
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);
    }
}
const getUsersAll = async (req, res) => {
    try {
        const users = await User.find()
        res.json({
            status: 200,
            ok: true,
            users,
        })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);

    }
}

//<-------------POST  create new user with password encryption ---------------->
const createUser = async (req, res) => {

    const { nombre, user, role, password, password2, img } = req.body;

    try {

        // Validation of user with username
        const validationUser = await User.findOne({ user });
        if (validationUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya esta registrado'
            });
        }
        //password encryption with bycryptjs
        const password = await bcryptjs.hash(req.body.password, 12);
        const newUser = new User(
            {
                nombre,
                user,
                role,
                password,
                img
            });
        // const salt = bcryptjs.genSaltSync();
        // users.password = bcryptjs.hashSync(password, salt);
        await newUser.save();

        const token = await generateJWT(newUser._id);

        res.status(200).json({
            ok: true,
            newUser,
            token,
            msg: 'Usuario creado con exito'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            error: 'No se ha podido registrar el usuario'
        });
    }
}

//<-------------------PUT edit user  --------------------------------->
const editUser = async (req, res) => {

    const _id = req.params.id;

    try {

        const findUserDB = await User.findById(_id);
        if (!findUserDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con ese id'
            });
        }
        //Includes all values ​​except those before 3 points
        const { password, user, ...dataUser } = req.body;

        //validation of if exist user before modify
        if (findUserDB.user !== req.body.user) {

            const validationUser = await User.findOne({ user });
            if (validationUser) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El nombre de usuario ya esta registrado'
                });
            }
        }

        //Update user
        dataUser.user = user;
        const userUpdate = await User.findByIdAndUpdate(_id, dataUser, { new: true });

        res.json({
            ok: true,
            user: userUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido actualizar al usuario'
        })
    }
}

//<-------------DELETE delete user in the database----------------->
const deleteUser = async (req, res) => {
    const _id = req.params.id;

    try {

        //Find user by id in db
        const findUserDB = await User.findById(_id);
        if (!findUserDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con ese id'
            });
        }
        //Delete user by id in db
        await User.findByIdAndDelete(_id);

        res.json({
            ok: true,
            msg: "Usuario eliminado con exito"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido actualizar al usuario'
        })
    }
}
//Exporting functions for the use in other files
module.exports = {
    getUsers,
    createUser,
    editUser,
    deleteUser,
    getUsersAll
}