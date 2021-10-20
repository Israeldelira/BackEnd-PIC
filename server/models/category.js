'use strict';
//Modules
const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

// Json to create a document for the database in mongoose
const CategorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'El nombre del provedor es requerido'],
        maxlength: [50, "El nombre de producto es muy largo"],
        trim: true,

    },
    
    status: {
        type: Boolean,
        default: true
    },

});
CategorySchema.plugin(uniquevalidator, {
    message: '{PATH} Debe ser unico y diferente'
});
const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;