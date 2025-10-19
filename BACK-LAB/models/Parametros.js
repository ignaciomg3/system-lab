const mongoose = require('mongoose');

// Schema para Parametros
const ParametrosSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  unidad: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  }
});

// mongoose.model('Parametros(model)', ParametrosSchema, 'tabla')
module.exports = mongoose.model('Parametros', ParametrosSchema, 'parametros');