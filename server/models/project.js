'use strict';
//Modules
const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

// Json to create a document for the database in mongoose
const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de proyecto es requerido'],
        trim: true,
        maxlength: [50, "El nombre de proyecto es muy largo"],

    },
    client: {
        type: String,
        required: [true, 'El cliente es requerido'],
        trim: true,
        maxlength: [40, "El cliente es muy largo"],
    },
    outputs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Output"
    },
}, {
    collection: "Project",
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
ProjectSchema.plugin(uniquevalidator, {
    message: '{PATH} Debe ser unico y diferente'
});
const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;