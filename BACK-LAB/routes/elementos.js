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
 *     description: Retorna una lista de todos los elementos ordenados por nombre.
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
    const elementos = await Elementos.find().sort({ nombre: 1 });

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


// BUSCAR ELEMENTOS POR NOMBRE (PARCIAL)
/**
 * @swagger
 * /api/elementos/buscar/{termino}:
 *   get:
 *     summary: Buscar elementos por nombre (parcial)
 *     tags: [Elementos]
 *     parameters:
 *       - in: path
 *         name: termino
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *     responses:
 *       200:
 *         description: Elementos encontrados
 *       500:
 *         description: Error interno del servidor
 */
router.get('/buscar/:termino', async (req, res) => {
  try {
    const { termino } = req.params;
    const regex = new RegExp(termino, 'i'); // Búsqueda insensible a mayúsculas/minúsculas

    const elementos = await Elementos.find({
      nombre: { $regex: regex }
    }).sort({ nombre: 1 });

    res.json({
      success: true,
      count: elementos.length,
      data: elementos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al buscar elementos',
      details: error.message
    });
  }
});

// OBTENER ELEMENTO POR NOMBRE
/**
 * @swagger
 * /api/elementos/{nombre}:
 *   get:
 *     summary: Obtener elemento por nombre
 *     tags: [Elementos]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del elemento
 *         example: "Agua"
 *     responses:
 *       200:
 *         description: Elemento encontrado exitosamente
 *       404:
 *         description: Elemento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:nombre', async (req, res) => {
  try {
    const nombre = req.params.nombre;

    const elemento = await Elementos.findOne({ nombre });

    if (!elemento) {
      return res.status(404).json({
        success: false,
        error: `Elemento con nombre ${nombre} no encontrado`
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
 *             $ref: '#/components/schemas/Elementos'
 *     responses:
 *       201:
 *         description: Elemento creado exitosamente
 *       400:
 *         description: Error de validación o elemento existente
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Validaciones básicas
    if (!nombre || !descripcion) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: nombre, descripcion'
      });
    }

    // Crear nuevo elemento
    const nuevoElemento = new Elementos({
      nombre,
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
        error: 'Ya existe un elemento con ese nombre'
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

// ACTUALIZAR ELEMENTO POR NOMBRE
/**
 * @swagger
 * /api/elementos/{nombre}:
 *   put:
 *     summary: Actualizar un elemento por su nombre
 *     tags: [Elementos]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del elemento a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Elementos'
 *     responses:
 *       200:
 *         description: Elemento actualizado exitosamente
 *       404:
 *         description: Elemento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:nombre', async (req, res) => {
  try {
    const nombre = req.params.nombre;
    const datosActualizacion = req.body;

    // Actualizar el elemento
    const elementoActualizado = await Elementos.findOneAndUpdate(
      { nombre },
      datosActualizacion,
      {
        new: true,
        runValidators: true
      }
    );

    if (!elementoActualizado) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el elemento con nombre ${nombre}`
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

// ELIMINAR ELEMENTO POR NOMBRE
/**
 * @swagger
 * /api/elementos/{nombre}:
 *   delete:
 *     summary: Eliminar un elemento por su nombre
 *     tags: [Elementos]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del elemento a eliminar
 *     responses:
 *       200:
 *         description: Elemento eliminado exitosamente
 *       404:
 *         description: Elemento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:nombre', async (req, res) => {
  try {
    const nombre = req.params.nombre;

    const elementoEliminado = await Elementos.findOneAndDelete({ nombre });

    if (!elementoEliminado) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el elemento con nombre ${nombre}`
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
