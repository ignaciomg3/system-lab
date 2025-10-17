const mongoose = require('mongoose');

// Schema para  Muestras
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

//  mongoose.model>('Muestras(model)', MuestrasSchema, 'tabla')
module.exports = mongoose.model('Muestras', MuestrasSchema, 'muestras');
