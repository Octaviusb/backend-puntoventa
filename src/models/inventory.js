const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    categoria: { 
        type: String, 
        required: true 
    },
    cantidad: { 
        type: Number, 
        required: true,
        min: 0
    },
    precio: { 
        type: Number, 
        required: true,
        min: 0
    },
    codigo: {
        type: String,
        unique: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Inventory', inventorySchema);