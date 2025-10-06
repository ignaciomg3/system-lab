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

/**
 * @swagger
 * /api/muestras/todas:
 *   get:
 *     summary: Obtiene todas las muestras con paginación
 *     description: Retorna una lista paginada de todas las muestras ordenadas por número de informe descendente.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página (por defecto 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de registros por página (por defecto 10)
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
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Muestras'
 *       500:
 *         description: Error interno al obtener las muestras
 */
// GET /api/muestras/todas?page=1&limit=10
router.get('/todas', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Obtener total de documentos para calcular páginas
    const total = await Muestras.countDocuments();
    
    // Obtener muestras con paginación y ordenamiento
    const muestras = await Muestras.find()
      .sort({ nro_informe: -1 }) // -1 para orden descendente (mayor a menor)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      count: muestras.length,
      totalPages: totalPages,
      currentPage: page,
      total: total,
      data: muestras
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener todas las muestras',
      details: error.message
    });
  }
});



module.exports = router;
