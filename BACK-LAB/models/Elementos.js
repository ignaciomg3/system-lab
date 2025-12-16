const mongoose = require('mongoose');

// Schema para Elementos
const ElementosSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  descripcion: { // Changed to 'descripcion' (no accent)
    type: String,
    required: true
  }
});

// Forzamos que busque en 'elemento_analizado'
module.exports = mongoose.model('Elementos', ElementosSchema, 'elemento_analizado');