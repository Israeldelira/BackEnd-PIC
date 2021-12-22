//Modules and files
const User = require('../models/users');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { getMenuFront } = require('../helpers/menuFrontend');


//<---------------------Login function----------------------->
const login = async (req, res) => {

    const { user, password } = req.body;

    try {
        //Search user by username
        const userDB = await User.findOne({ user })
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña o *usuario no valida'
            })
        }
        // password validation with bycrptjs

        const validPassword = bcryptjs.compareSync(password, userDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: '*Contraseña o usuario no valida'
            })
        }
        //call generate token function

        const token = await generateJWT(userDB._id);
        await
            res.json({
                status: 200,
                ok: true,
                token,
                menu: getMenuFront(userDB.role)

            })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);
    }
}

const renewToken = async (req,res)=>{
    const _id= req._id
    const token = await generateJWT(_id);
    const user = await User.findById(_id);
    res.json({
        ok:true,
        token,
        user,
        menu: getMenuFront(user.role)

    })
}
//Exporting functions for the use in other files
module.exports = {
    login,
    renewToken

}