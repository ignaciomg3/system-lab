const mongoose = require('mongoose');

// Schema para Plantillas
const PlantillasSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  solicitante: {
    type: String,
    required: false
  },
  parametros: [{
    nombre: {
      type: String,
      required: true
    },
    unidad: {
      type: String,
      required: true
    },
    tipo: {
      type: String,
      required: true
    }
  }]
});

// mongoose.model('Plantillas(model)', PlantillasSchema, 'plantillas(tabla)')
module.exports = mongoose.model('Plantillas', PlantillasSchema, 'plantillas');