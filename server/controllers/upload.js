const { response } = require('express');
const path = require('path');
const fs = require('fs');

const express = require('express');
const multer = require('multer');
const fileUp = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require('../helpers/update-Image')

async function uploadIMG(img) {
    if(img==""){
        return res.status(400).json({
            ok: false,
            msg: 'No se cargo imagen'
        });
    }else{
 const validExtension = ['png', 'jpg', 'jpeg'];
    const nameExtension = img.name.split('.');
    const extensionFile = nameExtension[nameExtension.length - 1];

    if (!validExtension.includes(extensionFile)) {
        return res.status(400).json({
            ok: false,
            msg: 'Extension no valida'
        });
    }
    if (!img || Object.keys(img).length === 0) {
        return res.status(400).send('No existe ningun archivo.');
    }

    const newName = `${uuidv4()}.${extensionFile}`;

    //path to save img in server 
    const path = `server/uploads/articles/${newName}`;
    console.log(path)
    img.mv(path, (err) => {
       
        if (err) {
            console.log("eSTE ES EL ERROR" + err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al guardar la imagen'
            });
        }
            
    })
    return newName 
    }
   
}
const fileUpload = (req, res = response) => {
    const type = req.params.type;
    const id = req.params.id;

    const validType = ['articles', 'users'];
    if (!validType.includes(type)) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha especificado una tipo para el archivo'
        });
    }

    // if (!req.files.img || Object.keys(req.files.img).length === 0) {
    //     return res.status(400).json({
    //         ok: false,
    //         msg: 'No hay ningún archivo'
    //     });
    // }

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
        updateImage(type, id, newName);

        res.status(200).json({
            ok: true,
            msg: 'Archivo subido',
            newName


        })
    });


}
const returnImg = (req, res) => {
    const type = req.params.type;
    const photo = req.params.photo
    const pathImg = path.join(__dirname, `../uploads/${type}/${photo}`);


    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg)
    }
    else {
        if (type === 'users') {
            const pathImgUser = path.join(__dirname, `../uploads/users/no-image-user.png`)
            res.sendFile(pathImgUser)
            console.log("este si entra+chido")
        } if (type === 'articles') {
            console.log("si entra");
            const pathImgArt = path.join(__dirname, `../uploads/articles/no-image.png`)
            res.sendFile(pathImgArt)
        }
        //    switch(type){
        //     //    case 'users':

        //     //    break;
        //     //    case 'articles':

        //     break;
        //    }
    }
}

// image default if no exist


module.exports = {
    fileUpload,
    returnImg,
    uploadIMG
}