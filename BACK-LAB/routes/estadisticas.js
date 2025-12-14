const express = require('express');
const mongoose = require('mongoose');
const Analisis = require('../models/Analisis');
const Muestras = require('../models/Muestras'); // Asegúrate de tener el modelo
const router = express.Router();


/**
 * @swagger
 * /api/estadisticas/coleccion/total/{nombreColeccion}:
 *   get:
 *     summary: Obtener el número total de documentos en una colección específica (FUNCIONA, pero no lo necesito para armar estadísticas)
 *     tags: [Estadísticas]
 *     parameters:
 *       - in: path
 *         name: nombreColeccion
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la colección de MongoDB
 *         example: "analisis"
 *     responses:
 *       200:
 *         description: Total de documentos en la colección
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "la colección si existe."
 *                 coleccion:
 *                   type: string
 *                   example: "analisis"
 *                 total:
 *                   type: number
 *                   example: 150
 *       404:
 *         description: Colección no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "la colección no existe."
 *       500:
 *         description: Error del servidor
 */
router.get('/coleccion/total/:nombreColeccion', async (req, res) => {
  try {
    const { nombreColeccion } = req.params;
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const coleccionExiste = collections.some(col => col.name === nombreColeccion);

    if (!coleccionExiste) {
      return res.json({
        success: false,
        message: 'la colección no existe.'
      });
    }

    const collection = db.collection(nombreColeccion);
    const total = await collection.countDocuments();

    res.json({
      success: true,
      message: 'la colección si existe.',
      coleccion: nombreColeccion,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el total de la colección',
      details: error.message
    });
  }
});


/**
 * @swagger
 * /api/estadisticas/analisis/porcentaje-por-cliente:
 *   get:
 *     summary: Obtener el porcentaje de análisis por cliente (FUNCIONA)
 *     tags: [Estadísticas]
 *     responses:
 *       200:
 *         description: Porcentaje de análisis por cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalAnalisis:
 *                   type: number
 *                 analisisPorCliente:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       cliente:
 *                         type: string
 *                       cantidad:
 *                         type: number
 *                       porcentaje:
 *                         type: number
 *       500:
 *         description: Error del servidor
 */
router.get('/analisis/porcentaje-por-cliente', async (req, res) => {
  try {
    // Obtener el total de análisis (reutilizando la lógica del otro endpoint)
    const totalAnalisis = await Analisis.countDocuments();
    
    // Obtener análisis agrupados por solicitante con porcentajes
    const analisisPorCliente = await Analisis.aggregate([
      {
        $group: {
          _id: '$solicitante',
          cantidad: { $sum: 1 }
        }
      },
      {
        $addFields: {
          porcentaje: {
            $multiply: [
              { $divide: ['$cantidad', totalAnalisis] },
              100
            ]
          }
        }
      },
      {
        $project: {
          _id: 0,
          cliente: '$_id',
          cantidad: 1,
          porcentaje: { $round: ['$porcentaje', 2] }
        }
      },
      {
        $sort: { porcentaje: -1 }
      }
    ]);

    res.json({
      success: true,
      totalAnalisis,
      analisisPorCliente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener porcentaje de análisis por cliente',
      details: error.message
    });
  }
});



module.exports = router;