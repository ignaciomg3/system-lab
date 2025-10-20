const express = require('express');
const Parametros = require('../models/Parametros');
const router = express.Router();

/***************************** GET ***********************************/

// OBTENER TODOS LOS PARAMETROS
/**
 * @swagger
 * /api/parametros:
 *   get:
 *     summary: Obtiene todos los parámetros
 *     tags: [Parámetros]
 *     description: Retorna una lista de todos los parámetros ordenados por nombre.
 *     responses:
 *       200:
 *         description: Lista de parámetros obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Parametros'
 *       500:
 *         description: Error interno al obtener los parámetros
 */
router.get('/', async (req, res) => {
  try {
    const parametros = await Parametros.find().sort({ nombre: 1 });
    
    res.json({
      success: true,
      count: parametros.length,
      data: parametros
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener los parámetros',
      details: error.message
    });
  }
});

// OBTENER PARAMETROS POR TIPO
/**
 * @swagger
 * /api/parametros/tipo/{tipo}:
 *   get:
 *     summary: Obtiene parámetros por tipo
 *     tags: [Parámetros]
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *         description: Tipo de parámetro
 *         example: "Bacteriológico"
 *     responses:
 *       200:
 *         description: Parámetros encontrados exitosamente
 *       404:
 *         description: No se encontraron parámetros de ese tipo
 *       500:
 *         description: Error interno del servidor
 */
router.get('/tipo/:tipo', async (req, res) => {
  try {
    const { tipo } = req.params;
    
    const parametros = await Parametros.find({ tipo }).sort({ nombre: 1 });
    
    if (parametros.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No se encontraron parámetros del tipo: ${tipo}`
      });
    }

    res.json({
      success: true,
      count: parametros.length,
      data: parametros
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener los parámetros por tipo',
      details: error.message
    });
  }
});

// OBTENER PARAMETRO POR ID
/**
 * @swagger
 * /api/parametros/{id}:
 *   get:
 *     summary: Obtiene un parámetro por su ID
 *     tags: [Parámetros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del parámetro
 *     responses:
 *       200:
 *         description: Parámetro encontrado exitosamente
 *       404:
 *         description: Parámetro no encontrado
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
        error: 'ID de parámetro inválido'
      });
    }

    const parametro = await Parametros.findById(id);
    
    if (!parametro) {
      return res.status(404).json({
        success: false,
        error: 'Parámetro no encontrado'
      });
    }

    res.json({
      success: true,
      data: parametro
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el parámetro',
      details: error.message
    });
  }
});

/***************************** POST ***********************************/

// CREAR NUEVO PARAMETRO
/**
 * @swagger
 * /api/parametros:
 *   post:
 *     summary: Crear un nuevo parámetro
 *     tags: [Parámetros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - unidad
 *               - tipo
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del parámetro
 *                 example: "Coliformes Fecales"
 *               unidad:
 *                 type: string
 *                 description: Unidad de medida
 *                 example: "UFC/100 ml"
 *               tipo:
 *                 type: string
 *                 description: Tipo de parámetro
 *                 example: "Bacteriológico"
 *     responses:
 *       201:
 *         description: Parámetro creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, unidad, tipo } = req.body;
    
    // Validaciones básicas
    if (!nombre || !unidad || !tipo) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: nombre, unidad, tipo'
      });
    }

    // Crear nuevo parámetro
    const nuevoParametro = new Parametros({
      nombre,
      unidad,
      tipo
    });

    // Guardar en base de datos
    const parametroGuardado = await nuevoParametro.save();

    res.status(201).json({
      success: true,
      message: 'Parámetro creado exitosamente',
      data: parametroGuardado
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe un parámetro con ese nombre'
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
      error: 'Error al crear el parámetro',
      details: error.message
    });
  }
});

/***************************** PUT ***********************************/

// ACTUALIZAR PARAMETRO POR NOMBRE
/**
 * @swagger
 * /api/parametros/{nombre}:
 *   put:
 *     summary: Actualizar un parámetro por su nombre
 *     tags: [Parámetros]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del parámetro a actualizar
 *         example: "Coliformes Fecales"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Coliformes Totales"
 *               unidad:
 *                 type: string
 *                 example: "NMP/100 ml"
 *               tipo:
 *                 type: string
 *                 example: "Microbiológico"
 *     responses:
 *       200:
 *         description: Parámetro actualizado exitosamente
 *       404:
 *         description: Parámetro no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:nombre', async (req, res) => {
  try {
    const { nombre } = req.params;
    const datosActualizacion = req.body;

    // Actualizar el parámetro por nombre
    const parametroActualizado = await Parametros.findOneAndUpdate(
      { nombre: nombre },
      datosActualizacion,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!parametroActualizado) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el parámetro con nombre: ${nombre}`
      });
    }

    res.json({
      success: true,
      message: 'Parámetro actualizado exitosamente',
      data: parametroActualizado
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe un parámetro con ese nombre'
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
      error: 'Error al actualizar el parámetro',
      details: error.message
    });
  }
});

/***************************** DELETE ***********************************/

// ELIMINAR PARAMETRO POR NOMBRE
/**
 * @swagger
 * /api/parametros/{nombre}:
 *   delete:
 *     summary: Eliminar un parámetro por su nombre
 *     tags: [Parámetros]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del parámetro a eliminar
 *         example: "Coliformes Fecales"
 *     responses:
 *       200:
 *         description: Parámetro eliminado exitosamente
 *       404:
 *         description: Parámetro no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:nombre', async (req, res) => {
  try {
    const { nombre } = req.params;
    
    const parametroEliminado = await Parametros.findOneAndDelete({ nombre: nombre });

    if (!parametroEliminado) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el parámetro con nombre: ${nombre}`
      });
    }

    res.json({
      success: true,
      message: 'Parámetro eliminado exitosamente'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el parámetro',
      details: error.message
    });
  }
});

module.exports = router;