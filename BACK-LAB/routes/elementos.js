const express = require('express');
const Elementos = require('../models/Elementos');
const router = express.Router();

/***************************** GET ***********************************/

// OBTENER TODOS LOS ELEMENTOS
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

// OBTENER ELEMENTO POR NOMBRE
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