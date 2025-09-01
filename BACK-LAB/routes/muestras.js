const express = require('express');
const Muestras = require('../models/Muestras');
const router = express.Router();


/**
 * @swagger
 * /api/muestras:
 *   get:
 *     summary: Obtiene las muestras por número de informe
 *     description: Retorna una lista de muestras filtradas por el parámetro nro_informe.
 *     parameters:
 *       - in: query
 *         name: nro_informe
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de informe para filtrar las muestras
 *     responses:
 *       200:
 *         description: Lista de muestras obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Muestras'
 *       400:
 *         description: Parámetro nro_informe faltante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       500:
 *         description: Error interno al obtener las muestras
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */




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
