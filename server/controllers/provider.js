//Modules and files
const Provider = require('../models/provider');

//<-------------GET all articles  ---------------->

const getProviders = async (req, res) => {
    try {
        const pagination = Number(req.query.pagination) || 0;
        console.log(pagination);
        //Search all users in db
        const [allProviders, total] = await Promise.all([
            Provider.find()
                .skip(pagination)
                .limit(5)
                .populate('registerUser', 'user'),

            Provider.countDocuments()
        ])

        res.json({
            status: 200,
            ok: true,
            total,
            allProviders,
        })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);
    }
}
const getProvidersAll = async (req, res) => {
    try {
        const providers = await Provider.find()
        res.json({
            status: 200,
            ok: true,
            providers,
        })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);

    }
}

const getProvider = async (req, res) => {
    const _id = req.params.id;
    try {
        const provider = await Provider.findById(_id)
            .populate('registerUser', 'user')
        res.json({
            status: 200,
            ok: true,
            provider: provider,
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
        registerUser: _id,
        ...req.body
    });
    const name = newProvider.name;
    try {

        // Validation of user with username
        const validationProvider = await Provider.findOne({ name });
        if (validationProvider) {
            return res.status(400).json({
                ok: false,
                msg: `El provedor: ${name} ya esta registrado`
            });
        }
        await newProvider.save();
        res.status(200).json({
            ok: true,
            newProvider,
            msg: `Provedor: ${name} fue creado con exito`
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
const editProvider = async (req, res) => {

    const _id = req.params.id;

    try {

        const findProviderDB = await Provider.findById(_id);
        if (!findProviderDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el provedor con ese id'
            });
        }

        //Includes all values ​​except those before 3 points
        const {
            name,
            ...dataProvider } = req.body;

        console.log("find " + findProviderDB.name)
        console.log("respuesta de form " + req.body.name)
        console.log("respuesta de form " + name)
        if (findProviderDB.name !== name) {

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
const deleteProvider = async (req, res) => {
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
    getProvider,
    getProvidersAll,
    createProvider,
    editProvider,
    deleteProvider
}