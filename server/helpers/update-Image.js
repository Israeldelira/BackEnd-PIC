const fs = require('fs')
const User=require('../models/users');
const Article=require('../models/article');

const deleteImg=(path)=>{
    if(fs.existsSync(path)){
        //delete previous image
        fs.unlinkSync(path);
}
}
const updateImage= async (type,id,newName)  =>{
    let pathOld='';
switch(type){
    case 'users':
        const user = await User.findById(id)
        if(!user){
            console.log('No es un usuario por id')
            return false;
        }
     pathOld = `./uploads/users/${user.img}`;
       deleteImg(pathOld) ;

        user.img=newName;
        await user.save();
        return true;

        

    case 'articles':
         const article = await Article.findById(id)
        if(!article){
            console.log('No es un articulo por id')
            return false;
        }
        console.log("nombre de archivo"+article.img)
        console.log("new name"+newName)
         pathOld = `./uploads/articles/${article.img}`;
        deleteImg(pathOld) 
        article.img=newName;
        // let strQRUpdate = JSON.stringify(article)
        // const updateQR = await QRCode.toDataURL(strQRUpdate)
        // const imageQR = await QRCode.toString(strQRUpdate, { type: 'terminal' })
        // article.codeQR = updateQR;
        // console.log(imageQR)
        

        await article.save();
        return true;

 
        

}
}
module.exports = {
    updateImage
}