const mongoose = require('mongoose');

// Schema para Resultados de Muestras
const MuestrasSchema = new mongoose.Schema({
  nro_informe: {
    type: Number,
    required: true
  },
  muestra_nombre: {
    type: String,
    required: true
  },
  parametros: {
    type: Object,
    required: true
  }
});

// Cambia el nombre de la colección a 'resultados_muestras'
module.exports = mongoose.model('Muestras', MuestrasSchema, 'resultados_muestras');
