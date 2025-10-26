const express = require('express');
const User = require('../models/Users');
const router = express.Router();

/****************************** GET ************************ */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios activos
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: usuario
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de usuario
 *         example: "admin.lab"
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo
 *         example: true
 *     responses:
 *       200:
 *         description: Lista de usuarios
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
 *                     $ref: '#/components/schemas/Users'
 */
router.get('/', async (req, res) => {
  try {
    const { usuario, activo } = req.query;
    let filter = {};

    if (activo !== undefined) {
      filter.activo = activo === 'true';
    } else {
      filter.activo = true;
    }

    if (usuario) filter.usuario = usuario;

    const users = await User.find(filter).select('-password');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/{usuario}:
 *   get:
 *     summary: Obtener un usuario por nombre de usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de usuario
 *         example: "admin.lab"
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:usuario', async (req, res) => {
  try {
    const user = await User.findOne({ usuario: req.params.usuario }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Usuario '${req.params.usuario}' no encontrado`
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el usuario',
      details: error.message
    });
  }
});

/****************************** POST ************************ */
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - password
 *               - rol
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nombre de usuario único
 *                 example: "admin.lab"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: "password_admin_secreta"
 *               rol:
 *                 type: string
 *                 enum: [admin, usuario, tecnico, supervisor]
 *                 description: Rol del usuario
 *                 example: "admin"
 *               activo:
 *                 type: boolean
 *                 description: Estado del usuario
 *                 example: true
 *             
 *           example:
 *             usuario: "admin"
 *             password: "password_admin_secreta"
 *             rol: "admin"
 *             activo: true
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
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
 *                   $ref: '#/components/schemas/Users'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', async (req, res) => {
  try {
    // Validar campos requeridos
    const { usuario, password, rol } = req.body;
    
    if (!usuario || !password || !rol) {
      return res.status(400).json({
        success: false,
        error: 'Los campos usuario, password y rol son requeridos'
      });
    }

    const user = new User(req.body);
    const savedUser = await user.save();
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: savedUser.getPublicProfile()
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `El ${field} ya está registrado`
      });
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Errores de validación',
        details: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al crear el usuario',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/{usuario}:
 *   put:
 *     summary: Actualizar un usuario por nombre de usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de usuario
 *         example: "admin.lab"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "nueva_password_123"
 *               rol:
 *                 type: string
 *                 enum: [admin, usuario, tecnico, supervisor]
 *                 example: "admin"
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:usuario', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { usuario: req.params.usuario },
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Usuario '${req.params.usuario}' no encontrado`
      });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Errores de validaciones',
        details: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al actualizar el usuario',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/{usuario}:
 *   delete:
 *     summary: Desactivar un usuario (soft delete)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de usuario
 *         example: "admin.lab"
 *     responses:
 *       200:
 *         description: Usuario desactivado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:usuario', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { usuario: req.params.usuario },
      { activo: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Usuario '${req.params.usuario}' no encontrado`
      });
    }

    res.json({
      success: true,
      message: 'Usuario desactivado exitosamente',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al desactivar el usuario',
      details: error.message
    });
  }
});

 

module.exports = router;
