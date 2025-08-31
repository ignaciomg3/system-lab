const express = require('express');
const Muestras = require('../models/Muestras');
const router = express.Router();

// GET /api/muestras?nro_informe=valor
router.get('/', async (req, res) => {
  try {
    const { nro_informe } = req.query;
    if (!nro_informe) {
      return res.status(400).json({
        success: false,
        error: 'Debe proporcionar el parámetro nro_informe'
      });
    }
    const muestras = await Muestras.find({ nro_informe: Number(nro_informe) });
    res.json({
      success: true,
      count: muestras.length,
      data: muestras
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener las muestras',
      details: error.message
    });
  }
});





module.exports = router;
