const {response} = require('express');
const fileUp = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');



const fileUpload = (req, res=response) => {
    const type = req.params.type;
    const id = req.params.id;

    const validType = ['articles', 'users'];
    if (!validType.includes(type)) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha especificado una tipo para el archivo'
        });
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No existe ningun archivo.');
    }

    const file = req.files.image
    const nameExtension = file.name.split('.');
    const extensionFile = nameExtension[nameExtension.length - 1];

    const validExtension = ['png', 'jpg', 'jpeg'];
    if (!validExtension.includes(extensionFile)) {
        return res.status(400).json({
            ok: false,
            msg: 'Extension no valida'
        });
    }
    const newName = `${uuidv4()}.${extensionFile}`;

    //path to save img in server 
    const path = `server/uploads/${type}/${newName}`;

    file.mv(path, (err) => {
        if (err) {
            console.log("eSTE ES EL ERROR" + err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al guardar la imagen'
            });
        }
        res.status(200).json({
            ok: true,
            msg: 'Archivo subido',
            newName


        })
    });


}
module.exports = {
    fileUpload,

}