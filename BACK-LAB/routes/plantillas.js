const express = require('express');
const Plantillas = require('../models/Plantillas');
const router = express.Router();

/***************************** GET ***********************************/

// OBTENER TODAS LAS PLANTILLAS
/**
 * @swagger
 * /api/plantillas:
 *   get:
 *     summary: Obtiene todas las plantillas
 *     tags: [Plantillas]
 *     description: Retorna una lista de todas las plantillas ordenadas por nombre.
 *     responses:
 *       200:
 *         description: Lista de plantillas obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Plantillas'
 *       500:
 *         description: Error interno al obtener las plantillas
 */
router.get('/', async (req, res) => {
  try {
    const plantillas = await Plantillas.find().sort({ nombre: 1 });
    
    res.json({
      success: true,
      count: plantillas.length,
      data: plantillas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener las plantillas',
      details: error.message
    });
  }
});

// OBTENER PLANTILLAS POR SOLICITANTE
/**
 * @swagger
 * /api/plantillas/solicitante/{solicitante}:
 *   get:
 *     summary: Obtiene plantillas por solicitante
 *     tags: [Plantillas]
 *     parameters:
 *       - in: path
 *         name: solicitante
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del solicitante
 *         example: "Municipalidad de B° Centro"
 *     responses:
 *       200:
 *         description: Plantillas encontradas exitosamente
 *       404:
 *         description: No se encontraron plantillas para ese solicitante
 *       500:
 *         description: Error interno del servidor
 */
router.get('/solicitante/:solicitante', async (req, res) => {
  try {
    const { solicitante } = req.params;
    
    const plantillas = await Plantillas.find({ solicitante }).sort({ nombre: 1 });
    
    if (plantillas.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No se encontraron plantillas para el solicitante: ${solicitante}`
      });
    }

    res.json({
      success: true,
      count: plantillas.length,
      data: plantillas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener las plantillas por solicitante',
      details: error.message
    });
  }
});

// OBTENER PLANTILLA POR ID
/**
 * @swagger
 * /api/plantillas/{id}:
 *   get:
 *     summary: Obtiene una plantilla por su ID
 *     tags: [Plantillas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la plantilla
 *     responses:
 *       200:
 *         description: Plantilla encontrada exitosamente
 *       404:
 *         description: Plantilla no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID sea válido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'ID de plantilla inválido'
      });
    }

    const plantilla = await Plantillas.findById(id);
    
    if (!plantilla) {
      return res.status(404).json({
        success: false,
        error: 'Plantilla no encontrada'
      });
    }

    res.json({
      success: true,
      data: plantilla
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener la plantilla',
      details: error.message
    });
  }
});

/***************************** POST ***********************************/

// CREAR NUEVA PLANTILLA
/**
 * @swagger
 * /api/plantillas:
 *   post:
 *     summary: Crear una nueva plantilla
 *     tags: [Plantillas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - solicitante
 *               - parametros
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la plantilla
 *                 example: "Microbiológico Básico"
 *               solicitante:
 *                 type: string
 *                 description: Nombre del solicitante
 *                 example: "Municipalidad de B° Centro"
 *               parametros:
 *                 type: array
 *                 description: Lista de parámetros
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       example: "Escherichia coli"
 *                     unidad:
 *                       type: string
 *                       example: "UFC/100 ml"
 *                     tipo:
 *                       type: string
 *                       example: "Microbiológico"
 *     responses:
 *       201:
 *         description: Plantilla creada exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, solicitante, parametros } = req.body;
    
    // Validaciones básicas
    if (!nombre || !solicitante || !parametros) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: nombre, solicitante, parametros'
      });
    }

    // Validar que parametros sea un array
    if (!Array.isArray(parametros)) {
      return res.status(400).json({
        success: false,
        error: 'El campo parametros debe ser un array'
      });
    }

    // Validar estructura de cada parámetro
    for (let i = 0; i < parametros.length; i++) {
      const param = parametros[i];
      if (!param.nombre || !param.unidad || !param.tipo) {
        return res.status(400).json({
          success: false,
          error: `Parámetro en posición ${i} debe tener: nombre, unidad y tipo`
        });
      }
    }

    // Crear nueva plantilla
    const nuevaPlantilla = new Plantillas({
      nombre,
      solicitante,
      parametros
    });

    // Guardar en base de datos
    const plantillaGuardada = await nuevaPlantilla.save();

    res.status(201).json({
      success: true,
      message: 'Plantilla creada exitosamente',
      data: plantillaGuardada
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe una plantilla con ese nombre'
      });
    }
    
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
      error: 'Error al crear la plantilla',
      details: error.message
    });
  }
});

/***************************** PUT ***********************************/

// ACTUALIZAR PLANTILLA POR NOMBRE
/**
 * @swagger
 * /api/plantillas/{nombre}:
 *   put:
 *     summary: Actualizar una plantilla por su nombre
 *     tags: [Plantillas]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la plantilla a actualizar
 *         example: "Microbiológico Básico"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Microbiológico Completo"
 *               solicitante:
 *                 type: string
 *                 example: "Municipalidad de B° Norte"
 *               parametros:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     unidad:
 *                       type: string
 *                     tipo:
 *                       type: string
 *     responses:
 *       200:
 *         description: Plantilla actualizada exitosamente
 *       404:
 *         description: Plantilla no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:nombre', async (req, res) => {
  try {
    const { nombre } = req.params;
    const datosActualizacion = req.body;

    // Si se actualiza parametros, validar estructura
    if (datosActualizacion.parametros && Array.isArray(datosActualizacion.parametros)) {
      for (let i = 0; i < datosActualizacion.parametros.length; i++) {
        const param = datosActualizacion.parametros[i];
        if (!param.nombre || !param.unidad || !param.tipo) {
          return res.status(400).json({
            success: false,
            error: `Parámetro en posición ${i} debe tener: nombre, unidad y tipo`
          });
        }
      }
    }

    // Actualizar la plantilla por nombre
    const plantillaActualizada = await Plantillas.findOneAndUpdate(
      { nombre: nombre },
      datosActualizacion,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!plantillaActualizada) {
      return res.status(404).json({
        success: false,
        error: `No se encontró la plantilla con nombre: ${nombre}`
      });
    }

    res.json({
      success: true,
      message: 'Plantilla actualizada exitosamente',
      data: plantillaActualizada
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe una plantilla con ese nombre'
      });
    }
    
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
      error: 'Error al actualizar la plantilla',
      details: error.message
    });
  }
});

/***************************** DELETE ***********************************/

// ELIMINAR PLANTILLA POR NOMBRE
/**
 * @swagger
 * /api/plantillas/{nombre}:
 *   delete:
 *     summary: Eliminar una plantilla por su nombre
 *     tags: [Plantillas]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la plantilla a eliminar
 *         example: "Microbiológico Básico"
 *     responses:
 *       200:
 *         description: Plantilla eliminada exitosamente
 *       404:
 *         description: Plantilla no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:nombre', async (req, res) => {
  try {
    const { nombre } = req.params;
    
    const plantillaEliminada = await Plantillas.findOneAndDelete({ nombre: nombre });

    if (!plantillaEliminada) {
      return res.status(404).json({
        success: false,
        error: `No se encontró la plantilla con nombre: ${nombre}`
      });
    }

    res.json({
      success: true,
      message: 'Plantilla eliminada exitosamente'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar la plantilla',
      details: error.message
    });
  }
});

module.exports = router;