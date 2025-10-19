const express = require('express');
const Elementos = require('../models/Elementos');
const router = express.Router();

/***************************** GET ***********************************/

// OBTENER TODOS LOS ELEMENTOS
/**
 * @swagger
 * /api/elementos:
 *   get:
 *     summary: Obtiene todos los elementos
 *     tags: [Elementos]
 *     description: Retorna una lista de todos los elementos.
 *     responses:
 *       200:
 *         description: Lista de elementos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Elementos'
 *       500:
 *         description: Error interno al obtener los elementos
 */
router.get('/', async (req, res) => {
  try {
    const elementos = await Elementos.find().sort({ nro_elemento: 1 });
    
    res.json({
      success: true,
      count: elementos.length,
      data: elementos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener los elementos',
      details: error.message
    });
  }
});

// OBTENER ELEMENTO POR NÚMERO
/**
 * @swagger
 * /api/elementos/{nro_elemento}:
 *   get:
 *     summary: Obtiene un elemento por su número
 *     tags: [Elementos]
 *     parameters:
 *       - in: path
 *         name: nro_elemento
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número del elemento
 *         example: 1
 *     responses:
 *       200:
 *         description: Elemento encontrado exitosamente
 *       404:
 *         description: Elemento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:nro_elemento', async (req, res) => {
  try {
    const nro_elemento = parseInt(req.params.nro_elemento);
    
    if (isNaN(nro_elemento)) {
      return res.status(400).json({
        success: false,
        error: 'El número de elemento debe ser un número válido'
      });
    }

    const elemento = await Elementos.findOne({ nro_elemento });
    
    if (!elemento) {
      return res.status(404).json({
        success: false,
        error: `Elemento con número ${nro_elemento} no encontrado`
      });
    }

    res.json({
      success: true,
      data: elemento
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el elemento',
      details: error.message
    });
  }
});

/***************************** POST ***********************************/

// CREAR NUEVO ELEMENTO
/**
 * @swagger
 * /api/elementos:
 *   post:
 *     summary: Crear un nuevo elemento
 *     tags: [Elementos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nro_elemento
 *               - descripcion
 *             properties:
 *               nro_elemento:
 *                 type: number
 *                 description: Número del elemento
 *                 example: 2
 *               descripcion:
 *                 type: string
 *                 description: Descripción del elemento
 *                 example: "Suelo"
 *     responses:
 *       201:
 *         description: Elemento creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', async (req, res) => {
  try {
    const { nro_elemento, descripcion } = req.body;
    
    // Validaciones básicas
    if (!nro_elemento || !descripcion) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: nro_elemento, descripcion'
      });
    }

    // Crear nuevo elemento
    const nuevoElemento = new Elementos({
      nro_elemento,
      descripcion
    });

    // Guardar en base de datos
    const elementoGuardado = await nuevoElemento.save();

    res.status(201).json({
      success: true,
      message: 'Elemento creado exitosamente',
      data: elementoGuardado
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe un elemento con ese número'
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
      error: 'Error al crear el elemento',
      details: error.message
    });
  }
});

/***************************** PUT ***********************************/

// ACTUALIZAR ELEMENTO POR NÚMERO
/**
 * @swagger
 * /api/elementos/{nro_elemento}:
 *   put:
 *     summary: Actualizar un elemento por su número
 *     tags: [Elementos]
 *     parameters:
 *       - in: path
 *         name: nro_elemento
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número del elemento a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Agua potable"
 *     responses:
 *       200:
 *         description: Elemento actualizado exitosamente
 *       404:
 *         description: Elemento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:nro_elemento', async (req, res) => {
  try {
    const nro_elemento = parseInt(req.params.nro_elemento);
    const datosActualizacion = req.body;

    if (isNaN(nro_elemento)) {
      return res.status(400).json({
        success: false,
        error: 'El número de elemento debe ser un número válido'
      });
    }

    // Actualizar el elemento
    const elementoActualizado = await Elementos.findOneAndUpdate(
      { nro_elemento },
      datosActualizacion,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!elementoActualizado) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el elemento con número ${nro_elemento}`
      });
    }

    res.json({
      success: true,
      message: 'Elemento actualizado exitosamente',
      data: elementoActualizado
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
      error: 'Error al actualizar el elemento',
      details: error.message
    });
  }
});

/***************************** DELETE ***********************************/

// ELIMINAR ELEMENTO POR NÚMERO
/**
 * @swagger
 * /api/elementos/{nro_elemento}:
 *   delete:
 *     summary: Eliminar un elemento por su número
 *     tags: [Elementos]
 *     parameters:
 *       - in: path
 *         name: nro_elemento
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número del elemento a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Elemento eliminado exitosamente
 *       404:
 *         description: Elemento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:nro_elemento', async (req, res) => {
  try {
    const nro_elemento = parseInt(req.params.nro_elemento);
    
    if (isNaN(nro_elemento)) {
      return res.status(400).json({
        success: false,
        error: 'El número de elemento debe ser un número válido'
      });
    }

    const elementoEliminado = await Elementos.findOneAndDelete({ nro_elemento });

    if (!elementoEliminado) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el elemento con número ${nro_elemento}`
      });
    }

    res.json({
      success: true,
      message: 'Elemento eliminado exitosamente'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el elemento',
      details: error.message
    });
  }
});

module.exports = router;