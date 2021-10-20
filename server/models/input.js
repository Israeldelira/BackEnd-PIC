'use strict';
//Modules
const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

// Json to create a document for the database in mongoose
const InputSchema = new mongoose.Schema({

    article: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    },
    registerUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    /*quantity: {
        type: Number,
        ref: 'Articulo'

    },*/
    quantity: {
        type: Number,
        min: [0, "No puede haber numeros negativos"],
        required:true
    }


}, {
    collection: "Input",
    timestamps: {
        createdAt: "created_at",
    },
});
InputSchema.plugin(uniquevalidator, {
    message: '{PATH} Debe ser unico y diferente'
});
const Input = mongoose.model('Input', InputSchema);
module.exports = Input;