const express = require('express');
const Clientes = require('../models/Clientes');
const router = express.Router();

/***************************** GET ***********************************/

// OBTENER TODOS LOS CLIENTES
/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtiene todos los clientes
 *     tags: [Clientes]
 *     description: Retorna una lista de todos los clientes ordenados por nombre.
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Clientes'
 *       500:
 *         description: Error interno al obtener los clientes
 */
router.get('/', async (req, res) => {
  try {
    const clientes = await Clientes.find().sort({ nombre: 1 });
    
    res.json({
      success: true,
      count: clientes.length,
      data: clientes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener los clientes',
      details: error.message
    });
  }
});

// OBTENER CLIENTE POR DNI/RAZÓN SOCIAL
/**
 * @swagger
 * /api/clientes/dni/{dni}:
 *   get:
 *     summary: Obtiene un cliente por DNI o Razón Social
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: dni
 *         required: true
 *         schema:
 *           type: string
 *         description: DNI o Razón Social del cliente
 *         example: "12345678"
 *     responses:
 *       200:
 *         description: Cliente encontrado exitosamente
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/dni/:dni', async (req, res) => {
  try {
    const { dni } = req.params;
    
    const cliente = await Clientes.findOne({ DNI_Razón_Social: dni });
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: `Cliente con DNI/Razón Social ${dni} no encontrado`
      });
    }

    res.json({
      success: true,
      data: cliente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el cliente',
      details: error.message
    });
  }
});

// BUSCAR CLIENTES POR NOMBRE
/**
 * @swagger
 * /api/clientes/buscar:
 *   get:
 *     summary: Busca clientes por nombre
 *     tags: [Clientes]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre a buscar (búsqueda parcial)
 *         example: "Juan"
 *     responses:
 *       200:
 *         description: Clientes encontrados exitosamente
 *       400:
 *         description: Parámetro nombre requerido
 *       404:
 *         description: No se encontraron clientes
 *       500:
 *         description: Error interno del servidor
 */
router.get('/buscar', async (req, res) => {
  try {
    const { nombre } = req.query;
    
    if (!nombre) {
      return res.status(400).json({
        success: false,
        error: 'El parámetro nombre es requerido'
      });
    }

    // Búsqueda insensible a mayúsculas/minúsculas
    const clientes = await Clientes.find({
      $or: [
        { nombre: { $regex: nombre, $options: 'i' } },
        { apellido: { $regex: nombre, $options: 'i' } }
      ]
    }).sort({ nombre: 1 });
    
    if (clientes.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No se encontraron clientes con el nombre: ${nombre}`
      });
    }

    res.json({
      success: true,
      count: clientes.length,
      data: clientes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al buscar clientes',
      details: error.message
    });
  }
});

// OBTENER CLIENTE POR ID
/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtiene un cliente por su ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado exitosamente
 *       404:
 *         description: Cliente no encontrado
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
        error: 'ID de cliente inválido'
      });
    }

    const cliente = await Clientes.findById(id);
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }

    res.json({
      success: true,
      data: cliente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el cliente',
      details: error.message
    });
  }
});

/***************************** POST ***********************************/

// CREAR NUEVO CLIENTE
/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - DNI_Razón_Social
 *               - nombre
 *               - mail
 *             properties:
 *               DNI_Razón_Social:
 *                 type: string
 *                 description: DNI o Razón Social del cliente
 *                 example: "12345678"
 *               nombre:
 *                 type: string
 *                 description: Nombre del cliente
 *                 example: "Juan Carlos"
 *               apellido:
 *                 type: string
 *                 description: Apellido del cliente (opcional)
 *                 example: "Pérez"
 *               teléfono:
 *                 type: string
 *                 description: Teléfono del cliente (opcional)
 *                 example: "+54 351 123-4567"
 *               mail:
 *                 type: string
 *                 description: Email del cliente
 *                 example: "juan.perez@email.com"
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', async (req, res) => {
  try {
    const { DNI_Razón_Social, nombre, apellido, teléfono, mail } = req.body;
    
    // Validaciones básicas
    if (!DNI_Razón_Social || !nombre || !mail) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: DNI_Razón_Social, nombre, mail'
      });
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de email inválido'
      });
    }

    // Crear nuevo cliente
    const nuevoCliente = new Clientes({
      DNI_Razón_Social,
      nombre,
      apellido,
      teléfono,
      mail
    });

    // Guardar en base de datos
    const clienteGuardado = await nuevoCliente.save();

    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: clienteGuardado
    });

  } catch (error) {
    if (error.code === 11000) {
      const camposDuplicados = Object.keys(error.keyPattern);
      return res.status(400).json({
        success: false,
        error: `Ya existe un cliente con ese ${camposDuplicados.join(', ')}`
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
      error: 'Error al crear el cliente',
      details: error.message
    });
  }
});

/***************************** PUT ***********************************/

// ACTUALIZAR CLIENTE POR DNI/RAZÓN SOCIAL
/**
 * @swagger
 * /api/clientes/{dni}:
 *   put:
 *     summary: Actualizar un cliente por DNI o Razón Social
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: dni
 *         required: true
 *         schema:
 *           type: string
 *         description: DNI o Razón Social del cliente a actualizar
 *         example: "12345678"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Carlos"
 *               apellido:
 *                 type: string
 *                 example: "González"
 *               teléfono:
 *                 type: string
 *                 example: "+54 351 987-6543"
 *               mail:
 *                 type: string
 *                 example: "juan.gonzalez@email.com"
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:dni', async (req, res) => {
  try {
    const { dni } = req.params;
    const datosActualizacion = req.body;

    // Validar email si se proporciona
    if (datosActualizacion.mail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(datosActualizacion.mail)) {
        return res.status(400).json({
          success: false,
          error: 'Formato de email inválido'
        });
      }
    }

    // Actualizar el cliente por DNI/Razón Social
    const clienteActualizado = await Clientes.findOneAndUpdate(
      { DNI_Razón_Social: dni },
      datosActualizacion,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!clienteActualizado) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el cliente con DNI/Razón Social: ${dni}`
      });
    }

    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: clienteActualizado
    });

  } catch (error) {
    if (error.code === 11000) {
      const camposDuplicados = Object.keys(error.keyPattern);
      return res.status(400).json({
        success: false,
        error: `Ya existe un cliente con ese ${camposDuplicados.join(', ')}`
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
      error: 'Error al actualizar el cliente',
      details: error.message
    });
  }
});

/***************************** DELETE ***********************************/

// ELIMINAR CLIENTE POR DNI/RAZÓN SOCIAL
/**
 * @swagger
 * /api/clientes/{dni}:
 *   delete:
 *     summary: Eliminar un cliente por DNI o Razón Social
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: dni
 *         required: true
 *         schema:
 *           type: string
 *         description: DNI o Razón Social del cliente a eliminar
 *         example: "12345678"
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:dni', async (req, res) => {
  try {
    const { dni } = req.params;
    
    const clienteEliminado = await Clientes.findOneAndDelete({ DNI_Razón_Social: dni });

    if (!clienteEliminado) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el cliente con DNI/Razón Social: ${dni}`
      });
    }

    res.json({
      success: true,
      message: 'Cliente eliminado exitosamente'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el cliente',
      details: error.message
    });
  }
});

module.exports = router;