//Librerias
const User = require('../models/users');
const bcryptjs = require('bcryptjs');

//Funciones de archivos
const { generateJWT } = require('../helpers/jwt');

//------------------GET USUARIOS------------------------
const getUsers = async (req, res) => {

    //Paginacion 
    const pagination = Number(req.query.pagination) || 0;

    try {
        //Promesa con resultado usuarios y total 
        const [usuarios, total] = await Promise.all([

            //Query - 1.-Usuarios con paginacion con limite de 5 usr y condicion de busqueda de status true
            User.find({ "status": true })
                .skip(pagination)
                .limit(5),

            //Query - 2.-Total de usuarios con condicion de status true
            User.countDocuments({ "status": true })
        ])

        //Resultado OK
        res.status(200).json({
            ok: true,
            usuarios,
            total
        });

        //Manejo de errores 
    } catch (err) {
        res.status(500).send({ error: 'Ocurrio un problema con el servidor' });
        console.log(err);
    }
}

//-------------------GET USERS SIN PAGINACION--------------------
const getUsersAll = async (req, res) => {

    try {

        //Query - Busqueda de usuarios con status true
        const users = await User.find({ "status": true })

        //Resultado OK
        res.json({
            status: 200,
            ok: true,
            users,
        })

        //Manejo de errores
    } catch (err) {
        res.status(500).send({ error: 'Ocurrio un problema con el servidor' });
        console.log(err);
    }
}

//<-------------POST Crear usuario ---------------->
const createUser = async (req, res) => {

    const { nombre, user, role, password, password2, img } = req.body;

    try {

        // Query - Buscar el usuario y guardarlo en la constante 'validationUser'
        const validationUser = await User.findOne({ user });

        //Validar si el usuario ya existe en la base de datos
        if (validationUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya esta registrado'
            });
        }

        //Crear el usuario y encriptar password con 12 caracteres
        const password = await bcryptjs.hash(req.body.password, 12);
        const newUser = new User(
            {
                nombre,
                user,
                role,
                password,
                img
            });

        //Guardar usuario
        await newUser.save();

        //Generar token llamando la funcion 'generateJWT' enviando como parametro el id del nuevo usuario 
        const token = await generateJWT(newUser._id);

        //Resultado OK
        res.status(200).json({
            ok: true,
            newUser,
            token,
            msg: 'Usuario creado con exito'
        });

        //Manejo de error
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            error: 'Error, no se pudo registar el usuario'
        });
    }
}

//<-------------------PUT editar usuario --------------------------------->
const editUser = async (req, res) => {

    //Extraemos el id de la url (params)
    const _id = req.params.id;

    try {

        // //Query-Busqueda usuario por '_id'
        const findUserDB = await User.findById(_id);

        //Validamos que exista el usuario con el _id'
        if (!findUserDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con ese id'
            });
        }

        //Validar que el usuario este activado antes de actualizar
        if (findUserDB.status === false) {
            return res.status(404).json({
                ok: false,
                msg: 'No se puede modificar un usuario desactivados'
            });
        }

        //Incluimos todos los valores en un arreglo a excepcion de todo lo contenido de 'dataUser'
        const { password, user, ...dataUser } = req.body;

        //Validamos si existe el mismo usuario antes de ser actualizado
        if (findUserDB.user !== req.body.user) {

            //Query-Busqueda usuario por 'user'
            const validationUser = await User.findOne({ user });
            if (validationUser) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El nombre de usuario ya esta registrado'
                });
            }
        }

        //Actualizamos el usuario
        dataUser.user = user;

        //Query de actualizar el usuario
        const userUpdate = await User.findByIdAndUpdate(_id, dataUser, { new: true });

        res.json({
            ok: true,
            user: userUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, no se pudo actualizar el usuario'
        })
    }
}

//<-------------DELETE delete user in the database----------------->
const deleteUser = async (req, res) => {
    const _id = req.params.id;

    try {

        //Eliminar usuario por completo 
        // const findUserDB = await User.findById(_id);
        // if (!findUserDB) {
        //     return res.status(404).json({
        //         ok: false,
        //         msg: 'No existe el usuario con ese id'
        //     });
        // }

        User.findByIdAndUpdate(_id, { status: false}, { new: true }, (err, userBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!userBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }

            res.status(200).json({
                ok: true,
                msg: "Usuario eliminado con exito",
                userBD

            });
        });

        // //Eliminar usuario por completo
        // // await User.findByIdAndDelete(_id);

        // res.json({
        //     ok: true,

        // })

        //Manejo de errores
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, ocurrio un problema con el servidor'
        })
    }
}
//Exportamos las funciones del archivo
module.exports = {
    getUsers,
    createUser,
    editUser,
    deleteUser,
    getUsersAll
}