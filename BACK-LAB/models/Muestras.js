const mongoose = require('mongoose');

// Schema para Resultados de Muestras
const MuestrasSchema = new mongoose.Schema({
  nro_informe: {
    type: Number,
    required: true
  },
  nro_muestra: {
    type: Number,
    required: true
  },
  muestra_nombre: {
    type: String,
    required: false
  },
  parametros: {
    type: Object,
    required: true
  }
});

// Cambia el nombre de la colección a 'Muestras, MuestrasSchema, 'tabla'
module.exports = mongoose.model('Muestras', MuestrasSchema, 'muestras');
