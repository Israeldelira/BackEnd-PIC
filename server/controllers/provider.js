//Modules and files
const Provider = require('../models/provider');

//<-------------GET all articles  ---------------->

const getProviders = async(req, res) => {
    try {

        //Search all users in db
        const allProviders = await Provider.find({})
        .populate('registerUser','nombre');
        await
        res.json({
            status: 200,
            ok: true,
            allProviders,
        })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);
    }
}

//<-------------POST  create new user with password encryption ---------------->
const createProvider = async (req, res) => {
    const _id = req._id;
    const newProvider = new Provider({
        registerUser:_id,
         ...req.body
        });
const name=newProvider.name ;
    try {

        // Validation of user with username
        const validationProvider = await Provider.findOne({ name });
        if (validationProvider) {
            return res.status(400).json({
                ok: false,
                msg: 'El provedor ya esta registrado'
            });
        }
        //password encryption with bycryptjs
        // const newProvider = new Provider(
        //     {
        //         name,
        //         phone,
        //         registerUser
                
        //     });
        // const salt = bcryptjs.genSaltSync();
        // users.password = bcryptjs.hashSync(password, salt);
        await newProvider.save();

        res.status(200).json({
            ok: true,
            newProvider,
            msg: 'Provedor creado con exito'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            error: 'No se ha podido registrar el provedor'
        });
    }
}

//<-------------------PUT edit user  --------------------------------->
const editProvider = async(req, res) => {

    const _id = req.params.id;

    try {

        const findProviderDB = await Provider.findById(_id);
        if (!findProviderDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el provedor con ese id'
            });
        }
        //Includes all values ​​except those before 3 points
        const { 
                name,
                 ... dataProvider } = req.body;


        if (findProviderDB.name !== req.body.name) {

            const validationProvider = await Provider.findOne({ name });
        if (validationProvider) {
            return res.status(400).json({
                ok: false,
                msg: 'El provedor ya esta registrado'
            });
        }
        }

        //Update user
        dataProvider.name = name;
        const providerUpdate = await Provider.findByIdAndUpdate(_id, dataProvider, { new: true });

        res.json({
            ok: true,
            user: providerUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido actualizar el provedor'
        })
    }
}

//<-------------DELETE delete user in the database----------------->
const deleteProvider = async(req, res) => {
        const _id = req.params.id;

        try {

            //Find user by id in db
            const findProviderDB = await Provider.findById(_id);
            if (!findProviderDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe el provedor con ese id'
                });
            }
            //Delete user by id in db
            await Provider.findByIdAndDelete(_id);

            res.json({
                ok: true,
                msg: "Provedor eliminado con exito"
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'No se ha podido eliminar al usuario'
            })
        }
    }
    //Exporting functions for the use in other files
module.exports = {
    getProviders,
    createProvider,
    editProvider,
    deleteProvider
}