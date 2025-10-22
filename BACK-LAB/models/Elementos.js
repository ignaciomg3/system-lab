const mongoose = require('mongoose');

// Schema para Elementos
const ElementosSchema = new mongoose.Schema({
  nro_elemento: {
    type: Number,
    required: true,
    unique: true
  },
  descripcion: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Elementos', ElementosSchema, 'elementos');