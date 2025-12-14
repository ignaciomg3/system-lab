const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS ANTES de otras configuraciones
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:4200',  // Angular
    'http://localhost:4201',  // Angular (puerto adicional)
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4200',
    'http://127.0.0.1:4201'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,  // ← Agregar esto para Swagger
  contentSecurityPolicy: false      // ← Agregar esto para Swagger
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Importar configuración de Swagger
const { specs, swaggerUi, swaggerOptions } = require('./config/swagger');

// Importar rutas

const analisisRoutes   = require('./routes/analisis');
const muestrasRoutes   = require('./routes/muestras');
const authRoutes       = require('./routes/auth');
const elementosRoutes  = require('./routes/elementos'); 
const parametrosRoutes = require('./routes/parametros');
const plantillasRoutes = require('./routes/plantillas'); // ← AGREGAR ESTA LÍNEA
const clientesRoutes   = require('./routes/clientes');
const usersRoutes      = require('./routes/users');




// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado exitosamente a MongoDB');
  console.log('📚 Documentación de la API: http://localhost:3000/api-docs/#/');
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error);
  process.exit(1);
});

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Servidor backend funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: 'http://localhost:3000/api-docs',
    collections: [
      'users',
      'analisis', 
      'muestras',
      'elementos',
      'parametros',
      'plantillas',
      'clientes',
      'Usuarios',
      'auth'
      
    ]
  });
});

// Configurar Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Rutas de la API
app.use('/api/auth', authRoutes); // Login
app.use('/api/users', usersRoutes);
app.use('/api/analisis', analisisRoutes);
app.use('/api/muestras', muestrasRoutes);
app.use('/api/elementos', elementosRoutes);
app.use('/api/parametros', parametrosRoutes);
app.use('/api/plantillas', plantillasRoutes);
app.use('/api/clientes', clientesRoutes);


// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en este servidor`
  });
});

// Middleware para manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Entorno: ${process.env.NODE_ENV}`);
});

module.exports = app;
