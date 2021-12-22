'use strict';
//Modules
const express = require('express');
const app = express();

//Index of all routes
app.use('/api/usuarios',require("./users"));
app.use('/api/articulos',require("./article"));
app.use('/api/category',require("./category"));
app.use('/api/provider',require("./provider"));
app.use('/api/search',require("./search"));
app.use('/api/login',require("./auth"));
app.use('/api/upload',require("./upload"));
app.use('/api/warehouse',require("./warehouse"));
app.use('/api/project',require("./project"));

module.exports = app;