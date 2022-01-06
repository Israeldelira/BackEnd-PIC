//Modules and files
const User = require('../models/users');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { getMenuFront } = require('../helpers/menuFrontend');


//<---------------------Login function----------------------->
const login = async (req, res) => {

    const { user, password } = req.body;

    try {
        const users = await User.find({ "status": true })
       
        if( Object.entries(users).length === 1){
            console.log("si entro la activacion")
            const updateUser = await User.findOneAndUpdate({ user: user }, { $set: { activate: true , role: "ADMIN" } }, { useFindAndModify: false, new: true })
            if (!updateUser) {
                return res.status(400).json({
                    ok: false,
                    msg: `Error con el servidor, hable con el administrador`
                });
            
            }
           }
            const userDB = await User.findOne({ user })
            
            if (!userDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Contraseña o *usuario no valido'
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
            if(!userDB.activate){
                return res.status(400).json({
                    ok: false,
                    msg: 'Tu usuario no esta activado habla con el administrador'
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
           
        //Search user by username
       
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