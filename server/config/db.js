'use strict';
//Modules and files
require('dotenv').config();
const mongoose = require('mongoose');
const { MONGO_LOCAL } = require('./config');

const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}

// const conenctToLocalDB = () => {
//     mongoose.connect(MONGO_LOCAL, connectionParams)
//     .then(() => console.log('Conexion Local Exitosa MONGO'))
//     .catch(err => console.log(err));
// }

const conenctToLocalDB = async () => {
    try {
        await mongoose.connect(MONGO_LOCAL, connectionParams)
        console.log('Conexion Local Exitosa MONGO')
    } catch {
        (error)
        console.log(error)
        throw new Error('Error al iniciar DB, Visualizar logs')


    }
}

/* Function of connection to mongo atlas

const connectToAtlas = () => {
    let url = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aippk.mongodb.net/${process.env.DATABASE}?authSource=admin&replicaSet=atlas-72cwcy-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`;
    mongoose.connect(url, connectionParams)
        .then(() => {
            console.log('Connected to database cluster')
        })
        .catch((err) => {
            console.error(`Error connecting to the database. \n${err}`);
        })
 }*/

module.exports = {
    // connectToAtlas,
    conenctToLocalDB,
};

