'use strict';
//Modules
const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

// Json to create a document for the database in mongoose
const UserSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es requerido'],
           
        },
        user: {
            type: String,
            required: [true, 'El Usuario es requerido'],
            trim: true,
            unique:[true,'El usuario ya existe']
        },
        role: {
            type: String,
            default: "ADMIN",
            enum:["USER","ADMIN"],
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'El password es requerido'],
         
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
        {
            collection: "User",
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at",
            },
        }
);
UserSchema.plugin(uniquevalidator, {
    message: '{PATH} Debe ser unico y diferente'
  });
const User = mongoose.model('User', UserSchema);
module.exports = User;




