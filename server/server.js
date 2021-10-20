'use strict';
//Modules and files
require("dotenv").config();
const fs = require("fs");
const cors = require('cors')
const https = require("https");
const express = require("express");
const bodyParser = require('body-parser');

const conexion = require("./config/db");
const { PORT } = require("./config/config");

//Servidor

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Configuracion del CORS
app.use(cors())
app.use(express.json());

//Index of routes
app.use(require("./routes/index"));


// Conexion de DB 
if (process.env.DEVELOPMENT) {
    conexion.conenctToLocalDB();
   }else{
     conexion.connectToAtlas();
   }
   
//SSL
   const credentials = {
    key: fs.readFileSync('./server/ssl/key.pem'),
    cert: fs.readFileSync('./server/ssl/cert.pem')
   }

//Server
   const serverStart = async () => {
    try {
        // start the server
        await https.createServer(credentials,app).listen(PORT);
        console.log( `Server HTTPS running at https://localhost:${ PORT }` );
    } catch ( err ) {
        console.log( "Ocurrio un error"+err );
        process.exit( 1 );
    }
};
serverStart();