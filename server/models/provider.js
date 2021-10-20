'use strict';
//Modules
const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

// Json to create a document for the database in mongoose
const ProviderSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'El nombre del provedor es requerido'],
        maxlength: [50, "El nombre de producto es muy largo"],
        trim: true,

    },
    phone: {
        type: Number,
        required: [true, 'El telefono de provedor es requerido'],
        trim: true,
        min: [10, "El telefono solo puede tener 10 digitos"]

    },

    registerUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: Boolean,
        default: true
    },

}, {
    collection: "Provider",
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
ProviderSchema.plugin(uniquevalidator, {
    message: '{PATH} Debe ser unico y diferente'
});
const Provider = mongoose.model('Provider', ProviderSchema);
module.exports = Provider;