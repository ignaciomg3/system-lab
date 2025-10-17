const express = require('express');
const Analisis = require('../models/Analisis');
const Muestras = require('../models/Muestras'); // Asegúrate de tener el modelo
const router = express.Router();






/**
 * @swagger
 * /api/analisis/total:
 *   get:
 *     summary: Obtener el número total de análisis
 *     tags: [Estadísticas]
 *     responses:
 *       200:
 *         description: Número total de análisis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: number
 */
router.get('/total', async (req, res) => {
  try {
    const total = await Analisis.countDocuments();
    res.json({
      success: true,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el total de análisis',
      details: error.message
    });
  }
});
//GET número TOTAL de ANALISIS. (que luego uso para hacer regla de 3 y sacar porcentajes en el front)
/**
 * @swagger
 * /api/analisis/total:
 *   get:
 *     summary: Obtener el número total de análisis
 *     tags: [Estadísticas]
 *     responses:
 *       200:
 *         description: Número total de análisis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: number
 */
router.get('/analisis/total', async (req, res) => {
  try {
    const total = await Analisis.countDocuments(); // cuenta todos los documentos
    res.json({
      success: true,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el total de análisis',
      details: error.message
    });
  }
});



/**
 * @swagger
 * /api/analisis/porcentajes-clientes:
 *   get:
 *     summary: Obtener porcentajes de análisis según cliente
 *     tags: [Estadísticas]
 *     responses:
 *       200:
 *         description: Porcentajes por cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */


router.get('/clientes/porcentaje', async (req, res) => {
  try {
    const result = await Analisis.aggregate([
      {
        $group: {
          _id: "$solicitante",
          total: { $sum: 1 }
        }
      },
      {
        $setWindowFields: {
          output: {
            totalGeneral: {
              $sum: "$total",
              window: { documents: ["unbounded", "unbounded"] }
            }
          }
        }
      },
      {
        $project: {
          cliente: "$_id",
          total: 1,
          porcentaje: {
            $round: [
              { $multiply: [{ $divide: ["$total", "$totalGeneral"] }, 100] },
              2
            ]
          },
          _id: 0
        }
      }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



/**
 * @swagger
 * /analisis/porcentaje:
 *   get:
 *     summary: Obtener porcentaje de análisis por solicitante
 *     tags: [Estadísticas]
 *     description: Devuelve el total de análisis y el porcentaje de cada solicitante.
 *     responses:
 *       200:
 *         description: Lista de solicitantes con su porcentaje
 */
router.get("/analisis/porcentaje", async (req, res) => {
  try {
    const result = await Analisis.aggregate([
      {
        $group: {
          _id: "$solicitante",
          total: { $sum: 1 }
        }
      },
      {
        $setWindowFields: {
          output: {
            totalGeneral: {
              $sum: "$total",
              window: { documents: ["unbounded", "unbounded"] }
            }
          }
        }
      },
      {
        $project: {
          solicitante: "$_id",
          total: 1,
          porcentaje: {
            $concat: [
              { $toString: { $round: [{ $multiply: [{ $divide: ["$total", "$totalGeneral"] }, 100] }, 2] } },
              "%"
            ]
          },
          _id: 0
        }
      }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;