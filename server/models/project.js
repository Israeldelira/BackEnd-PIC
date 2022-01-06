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
    // registerUser: {
    //     type: String,
    //     required: [true, 'El nombre de quien registro es requerido'],
    //     trim: true,
      
    // },
    registerUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // outputs: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Output"
    // },
    outputs:
        [{
            article: {
                type: String,
                required:true
            },
            description: {
                type: String,
                required: [true, 'La descripcion de la salida del articulo es requerida'],
                trim: true,
            },
            quantity: {
                type: Number,
                min: [0, "No puede haber numeros negativos"]
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
        ]
    ,
    manager: {
        type: String,
        required: [true, 'El encargado del proyecto es requerido'],
    },
    status: {
        type: Boolean,
        default: true,
    },
    complete: {
        type: Boolean,
        default: false,
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