'use strict';
//Modules
const express = require('express');
const app = express();

//Index of all routes
app.use('/api/usuarios',require("./users"));
app.use('/api/login',require("./auth"));

module.exports = app;