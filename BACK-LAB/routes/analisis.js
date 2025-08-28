const express = require('express');
const Analisis = require('../models/Analisis');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Analisis:
 *       type: object
 *       required:
 *         - nro_informe
 *         - solicitante
 *         - fecha
 *         - estado
 *         - tipo_analisis
 *       properties:
 *         nro_informe:
 *           type: number
 *           description: Número único del informe
 *           example: 39
 *         solicitante:
 *           type: string
 *           description: Empresa o persona que solicita el análisis
 *           example: "AGUAS CORDOBESAS S.A."
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha del análisis
 *           example: "1997-08-07"
 *         responsable:
 *           type: string
 *           nullable: true
 *           description: Responsable del análisis
 *           example: null
 *         estado:
 *           type: string
 *           description: Estado actual del análisis
 *           example: "Hecho"
 *         tipo_analisis:
 *           type: string
 *           description: Tipo de análisis realizado
 *           example: "BACTERIOLOGICO COMPLETO"
 */

/**
 * @swagger
 * /api/analisis:
 *   get:
 *     summary: Obtener todos los análisis
 *     tags: [Análisis]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Filtrar por estado
 *         example: "Hecho"
 *       - in: query
 *         name: solicitante
 *         schema:
 *           type: string
 *         description: Filtrar por solicitante
 *         example: "AGUAS CORDOBESAS S.A."
 *       - in: query
 *         name: tipo_analisis
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de análisis
 *         example: "BACTERIOLOGICO COMPLETO"
 *     responses:
 *       200:
 *         description: Lista de análisis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Analisis'
 */
router.get('/', async (req, res) => {
  try {
    const analisis = await Analisis.find({});
    res.json({
      success: true,
      count: analisis.length,
      data: analisis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener análisis',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/analisis/{nro_informe}:
 *   get:
 *     summary: Obtener un análisis por número de informe
 *     tags: [Análisis]
 *     parameters:
 *       - in: path
 *         name: nro_informe
 *         required: true
 *         schema:
 *           type: number
 *         description: Número del informe
 *         example: 39
 *     responses:
 *       200:
 *         description: Análisis encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Analisis'
 *       404:
 *         description: Análisis no encontrado
 */
router.get('/:nro_informe', async (req, res) => {
  try {
    const nro_informe = parseInt(req.params.nro_informe);
    
    if (isNaN(nro_informe)) {
      return res.status(400).json({
        success: false,
        error: 'El número de informe debe ser un número válido'
      });
    }
    
    const analisis = await Analisis.findOne({ nro_informe: nro_informe });
    
    if (!analisis) {
      return res.status(404).json({
        success: false,
        error: `Análisis con número de informe ${nro_informe} no encontrado`
      });
    }

    res.json({
      success: true,
      data: analisis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el análisis',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/analisis:
 *   post:
 *     summary: Crear un nuevo análisis
 *     tags: [Análisis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Analisis'
 *     responses:
 *       201:
 *         description: Análisis creado exitosamente
 *       400:
 *         description: Error de validación
 */
// Crear un nuevo análisis (POST)
router.post('/', async (req, res) => {
  try {
    const nuevoAnalisis = new Analisis(req.body);
    const resultado = await nuevoAnalisis.save();
    res.status(201).json({ success: true, data: resultado });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @swagger
 * /api/analisis/{nro_informe}:
 *   put:
 *     summary: Actualizar un análisis por número de informe
 *     tags: [Análisis]
 *     parameters:
 *       - in: path
 *         name: nro_informe
 *         required: true
 *         schema:
 *           type: number
 *         description: Número del informe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Analisis'
 *     responses:
 *       200:
 *         description: Análisis actualizado exitosamente
 *       404:
 *         description: Análisis no encontrado
 */
router.put('/:nro_informe', async (req, res) => {
  try {
    const nro_informe = parseInt(req.params.nro_informe);

    if (isNaN(nro_informe)) {
      return res.status(400).json({
        success: false,
        error: 'El número de informe debe ser un número válido'
      });
    }

    const analisis = await Analisis.findOneAndUpdate(
      { nro_informe: nro_informe },
      req.body,
      { new: true, runValidators: true }
    );

    if (!analisis) {
      return res.status(404).json({
        success: false,
        error: `Análisis con número de informe ${nro_informe} no encontrado`
      });
    }

    res.json({
      success: true,
      message: 'Análisis actualizado exitosamente',
      data: analisis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el análisis',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/analisis/{nro_informe}:
 *   delete:
 *     summary: Eliminar un análisis por número de informe
 *     tags: [Análisis]
 *     parameters:
 *       - in: path
 *         name: nro_informe
 *         required: true
 *         schema:
 *           type: number
 *         description: Número del informe a eliminar
 *     responses:
 *       200:
 *         description: Análisis eliminado exitosamente
 *       404:
 *         description: Análisis no encontrado
 */
router.delete('/:nro_informe', async (req, res) => {
  try {
    const nro_informe = parseInt(req.params.nro_informe);

    if (isNaN(nro_informe)) {
      return res.status(400).json({
        success: false,
        error: 'El número de informe debe ser un número válido'
      });
    }

    const analisis = await Analisis.findOneAndDelete({ nro_informe: nro_informe });

    if (!analisis) {
      return res.status(404).json({
        success: false,
        error: `Análisis con número de informe ${nro_informe} no encontrado`
      });
    }

    res.json({
      success: true,
      message: 'Análisis eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el análisis',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/analisis/porcentajes-clientes:
 *   get:
 *     summary: Obtener porcentajes de análisis según cliente
 *     tags: [Análisis]
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
