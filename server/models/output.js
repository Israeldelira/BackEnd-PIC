'use strict';
//Modules
const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

// Json to create a document for the database in mongoose
const OutputSchema = new mongoose.Schema({

    article: {
        type: Schema.Types.ObjectId,
        ref: "Article",
        required:true
    },
    registerUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
        
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required:true
    },
    description: {
        type: String,
        required: [true, 'La descripcion de la salida del articulo es requerida'],
        maxlength: [250, "Descripcion de la salida del articulo es muy larga"],
        trim: true,

    },

    /* proyect: {
        type: String,
        required: [true, 'El nombre del proyecto es requerido'],
        maxlength: [50, "El nombre del proyecto es muy largo"],
        trim: true,
/*
    },
    /*quantity: {
        type: Number,
        ref: 'Articulo'

    },*/
    quantity: {
        type: Number,
        min: [0, "No puede haber numeros negativos"]
    }

}, {
    collection: "Output",
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});

OutputSchema.plugin(uniquevalidator, {
    message: '{PATH} Debe ser unico y diferente'
});
const Output = mongoose.model('Output', OutputSchema);
module.exports = Output;