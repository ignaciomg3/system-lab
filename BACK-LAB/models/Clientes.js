const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  DNI_Razón_Social: {
    type: String,
    required: true,
    unique: true // Asegura que no se repitan los clientes
  },
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: false // Opcional si es una Razón Social
  },
  teléfono: {
    type: String,
    required: false
  },
  mail: {
    type: String,
    required: true,
    unique: true // Opcional, pero recomendable
  }
});

module.exports = mongoose.model('Cliente', ClienteSchema, 'clientes');