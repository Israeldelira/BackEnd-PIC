const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

// Json to create a document for the database in mongoose
const ArticleSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        required: [true, 'El nombre del articulo es requerido'],
        maxlength: [50, "El nombre de producto es muy largo"],
        trim: true,

    },
    model: {
        type: String,
        required: [true, 'El modelo es requerido'],
        maxlength: [20, "El modelo es muy largo"],
        trim: true,

    },
    trademark: {
        type: String,
        required: [true, 'La marca es requerida'],
        maxlength: [20, "La marca es muy larga"],
        trim: true,

    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    
    },
    
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
    
    },
    registerUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
   
    },
    levelStock: {
        type: String,
        default: "Alto",
        enum:["Alto","Medio"],
        required: true,
        trim: true,
       
    },
  
    date: {
        type: Date,
        default: Date.now
    },
    img: {
        type: String,
    },
    codeQR: {
        type: String,
        unique: true,
       
    },
    quantity: {
        type: Number,
        min: [0, "No puede haber numeros negativos"]
    },
    status: {
        type: Boolean,
        default: true
    },
}, 
{
    collection: "Article",
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});

const Article = mongoose.model('Article',ArticleSchema);
module.exports = Article;