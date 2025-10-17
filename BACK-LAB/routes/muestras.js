const express = require('express');
const Muestras = require('../models/Muestras');
const router = express.Router();


/**
 * @swagger
 * /api/muestras:
 *   get:
 *     summary: Obtiene las muestras por número de informe
 *     tags: [Muestras]
 *     description: Retorna una lista de muestras filtradas por el parámetro nro_informe.
 *     parameters:
 *       - in: query
 *         name: nro_informe
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de informe para filtrar las muestras
 *         example: 6184
 *       - in: query
 *         name: nro_muestra
 *         required: false
 *         schema:
 *           type: string
 *         description: Número de muestra para filtrar las muestras
 *         example: "1"
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
 *         description: Debe proporcionar al menos un parámetro de filtro
 *       500:
 *         description: Error interno al obtener las muestras
 */

// GET /api/muestras?nro_informe=valor&nro_muestra=valor
router.get('/', async (req, res) => {
  try {
    const { nro_informe, nro_muestra } = req.query;
    
    // Construir filtro dinámico
    let filter = {};
    
    if (nro_informe) {
      filter.nro_informe = Number(nro_informe);
    }
    
    if (nro_muestra) {
      filter.nro_muestra = nro_muestra;
    }

    // Si no hay filtros, devolver error
    if (Object.keys(filter).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Debe proporcionar al menos uno de los parámetros: nro_informe o nro_muestra'
      });
    }

    //guarda las muestras que cumplen con el filtro:
    const muestras = await Muestras.find(filter);
    
    res.json({
      success: true,
      count: muestras.length,
      data: muestras
    });
  } catch (error) {
    // Responde 500 y devuelve un mensaje genérico; 'details' contiene error.message para depuración
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
 *     tags: [Muestras]
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


/**
 * @swagger
 * /api/muestras:
 *   post:
 *     summary: Crear una nueva muestra
 *     tags: [Muestras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nro_informe
 *               - muestra_nombre
 *               - parametros
 *             properties:
 *               nro_informe:
 *                 type: number
 *                 description: Número de informe
 *                 example: 9999
 *               nro_muestra:
 *                 type: number
 *                 description: Número de muestra
 *                 example: 1
 *               muestra_nombre:
 *                 type: string
 *                 description: Nombre de la muestra
 *                 example: "Agua del río Pilcomayo"
 * 
 *               parametros:
 *                 type: object
 *                 description: Parámetros analizados con sus valores y unidades
 *                 example:
 *                   DBO5:
 *                     valor: 7
 *                     unidad: "mg/l"
 *                   pH:
 *                     valor: 7.2
 *                     unidad: "medida"
 *     responses:
 *       201:
 *         description: Muestra creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Muestras'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', async (req, res) => {
  try {
    const { nro_informe, nro_muestra, muestra_nombre, parametros } = req.body;
    
    // Validaciones básicas
    if (!nro_informe || !nro_muestra || !parametros) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: nro_informe, nro_muestra, parametros'
      });
    }

    // Crear nueva muestra
    const nuevaMuestra = new Muestras({
      nro_informe,
      nro_muestra,
      muestra_nombre,
      parametros
    });

    // Guardar en base de datos
    const muestraGuardada = await nuevaMuestra.save();

    res.status(201).json({
      success: true,
      message: 'Muestra creada exitosamente',
      data: muestraGuardada
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Errores de validación',
        details: errores
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al crear la muestra',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/muestras:
 *   delete:
 *     summary: Eliminar muestras por número de informe y opcionalmente por número de muestra
 *     tags: [Muestras]
 *     description: Elimina una o múltiples muestras filtradas por nro_informe y opcionalmente por nro_muestra.
 *     parameters:
 *       - in: query
 *         name: nro_informe
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de informe (requerido)
 *         example: 9999
 *       - in: query
 *         name: nro_muestra
 *         required: false
 *         schema:
 *           type: string
 *         description: Número de muestra (opcional)
 *         example: "1"
 *     responses:
 *       200:
 *         description: Muestras eliminadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deletedCount:
 *                   type: integer
 *       400:
 *         description: Parámetro nro_informe es requerido
 *       404:
 *         description: No se encontraron muestras para eliminar
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/', async (req, res) => {
  try {
    const { nro_informe, nro_muestra } = req.query;
    
    // Validar que nro_informe sea proporcionado
    if (!nro_informe) {
      return res.status(400).json({
        success: false,
        error: 'El parámetro nro_informe es requerido para eliminar muestras'
      });
    }

    // Construir filtro para eliminación
    let filter = {
      nro_informe: Number(nro_informe)
    };
    
    // Agregar nro_muestra al filtro si se proporciona
    if (nro_muestra) {
      filter.nro_muestra = nro_muestra;
    }

    // Eliminar muestras que coincidan con el filtro
    const resultado = await Muestras.deleteMany(filter);

    // Verificar si se eliminó alguna muestra
    if (resultado.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontraron muestras que coincidan con los criterios especificados'
      });
    }

    res.json({
      success: true,
      message: `Se eliminaron ${resultado.deletedCount} muestra(s) exitosamente`,
      deletedCount: resultado.deletedCount
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar las muestras',
      details: error.message
    });
  }
});

module.exports = router;
