const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema Laboratorio',
      version: '1.0.0',
      description: 'API Laboratorio de Análisis',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticación'
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de acceso faltante o inválido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'string',
                    example: 'Token no válido'
                  }
                }
              }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'string',
                    example: 'Recurso no encontrado'
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Error de validación',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'string',
                    example: 'Errores de validación'
                  },
                  details: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: ['El nombre es obligatorio', 'El email debe ser válido']
                  }
                }
              }
            }
          }
        },
        ServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'string',
                    example: 'Error interno del servidor'
                  },
                  details: {
                    type: 'string',
                    example: 'Descripción del error específico'
                  }
                }
              }
            }
          }
        }
      },
      schemas: {
        Analisis: {
          type: 'object',
          required: ['nro_informe', 'fecha_ingreso', 'solicitante'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del análisis'
            },
            nro_informe: {
              type: 'number',
              description: 'Número de informe',
              example: 39
            },
            fecha_ingreso: {
              type: 'string',
              format: 'date',
              description: 'Fecha de ingreso del análisis',
              example: '2023-10-19'
            },
            fecha_informe: {
              type: 'string',
              format: 'date',
              description: 'Fecha del informe',
              example: '2023-10-20'
            },
            solicitante: {
              type: 'string',
              description: 'Nombre del solicitante',
              example: 'AGUAS CORDOBESAS S.A.'
            },
            direccion: {
              type: 'string',
              description: 'Dirección del solicitante',
              example: 'Av. Colón 1234'
            },
            tipo_analisis: {
              type: 'string',
              description: 'Tipo de análisis realizado',
              example: 'BACTERIOLOGICO COMPLETO'
            },
            estado: {
              type: 'string',
              description: 'Estado del análisis',
              example: 'Hecho',
              enum: ['Pendiente', 'En Proceso', 'Hecho', 'Cancelado']
            },
            observaciones: {
              type: 'string',
              description: 'Observaciones adicionales'
            }
          }
        },
        Muestras: {
          type: 'object',
          required: ['nro_informe', 'muestra_nombre', 'parametros'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único de la muestra'
            },
            nro_informe: {
              type: 'number',
              description: 'Número de informe',
              example: 6177
            },
            nro_muestra: {
              type: 'string',
              description: 'Número de muestra',
              example: '1'
            },
            muestra_nombre: {
              type: 'string',
              description: 'Nombre de la muestra',
              example: 'Agua Lago Interno de Recreación'
            },
            parametros: {
              type: 'object',
              description: 'Parámetros analizados',
              example: {
                DBO5: {
                  valor: 7,
                  unidad: 'mg/l'
                }
              }
            }
          }
        },
        Parametros: {
          type: 'object',
          required: ['nombre', 'unidad', 'tipo'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del parámetro'
            },
            nombre: {
              type: 'string',
              description: 'Nombre del parámetro',
              example: 'Coliformes Fecales'
            },
            unidad: {
              type: 'string',
              description: 'Unidad de medida',
              example: 'UFC/100 ml'
            },
            tipo: {
              type: 'string',
              description: 'Tipo de parámetro',
              example: 'Bacteriológico'
            }
          }
        },
        Elementos: {
          type: 'object',
          required: ['nro_elemento', 'descripcion'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del elemento'
            },
            nro_elemento: {
              type: 'number',
              description: 'Número del elemento',
              example: 1
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del elemento',
              example: 'Agua'
            }
          }
        },
        Users: {
          type: 'object',
          required: ['usuario', 'password', 'rol'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            usuario: {
              type: 'string',
              description: 'Nombre de usuario único',
              example: 'admin.lab'
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario (hasheada)',
              example: '$2b$10$...'
            },
            rol: {
              type: 'string',
              enum: ['admin', 'usuario', 'tecnico', 'supervisor'],
              description: 'Rol del usuario en el sistema',
              example: 'admin'
            },
            activo: {
              type: 'boolean',
              description: 'Estado del usuario',
              example: true,
              default: true
            },
            fecha_creacion: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del usuario'
            }
          }
        },
        Plantillas: {
          type: 'object',
          required: ['nombre', 'parametros'],
          properties: {

            nombre: {
              type: 'string',
              description: 'Nombre de la plantilla',
              example: 'Plantilla de Informe de Análisis'
            },
            solicitante: {
              type: 'string',
              description: 'Solicitante asociado a la plantilla',
              example: 'AGUAS CORDOBESAS S.A.'
            },
            parametros: {
              type: 'array',
              description: 'Lista de parámetros incluidos en la plantilla',
              items: {
                type: 'string',
                example: 'DBO5'
              }
            }
          }
        }

      }
    },
    security: [
      { bearerAuth: [] }
    ],

    tags: [

      {
        name: 'Análisis',
        description: 'Gestión de análisis de laboratorio'
      },
      {
        name: 'Muestras',
        description: 'Gestión de muestras de laboratorio'
      },
      {
        name: 'Plantillas',
        description: 'Gestión de plantillas de análisis'
      },
      {
        name: 'Estadísticas',
        description: 'Estadísticas y reportes de análisis'
      },
      {
        name: 'Parámetros',
        description: 'Gestión de parámetros de análisis'
      },
      {
        name: 'Elementos',
        description: 'Gestión de elementos de análisis'
      },
      {
        name: 'Clientes',
        description: 'Gestión de clientes del laboratorio'
      },
      {
        name: 'Usuarios',
        description: 'Operaciones relacionadas con usuarios'
      },
      {
        name: 'Autenticación',
        description: 'Endpoints para login, logout y gestión de autenticación'
      }
    ]
  },
  apis: [
    './routes/*.js', // Rutas donde están los comentarios de Swagger
    './models/*.js'  // Modelos donde pueden estar esquemas adicionales
  ],
};

const specs = swaggerJsdoc(options);

// Configuración personalizada de Swagger UI
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    filter: true,
    tryItOutEnabled: true,
    requestInterceptor: (req) => {
      req.headers['Accept'] = 'application/json';
      req.headers['Content-Type'] = 'application/json';
      return req;
    }
  },
  //Estilos personalizados
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #1f2937; }
    .swagger-ui .scheme-container { 
      background: #f8f9fa; 
      border: 1px solid #e9ecef; 
      border-radius: 4px; 
      padding: 10px; 
      margin-bottom: 20px; 
    }
    
    /* AGREGA AQUÍ LOS NUEVOS ESTILOS DE COLORES */
    .swagger-ui .opblock-tag[data-tag="Análisis"] {
      background-color: #95bcfaff !important;
      color: white !important;
    }
    
    .swagger-ui .opblock-tag[data-tag="Muestras"] {
      background-color: #8cedcdff !important;
      color: white !important;
    }
    
    .swagger-ui .opblock-tag[data-tag="Parámetros"] {
      background-color: #fad390ff !important;
      color: white !important;
    }
    
    .swagger-ui .opblock-tag[data-tag="Estadísticas"] {
      background-color: #675987ff !important;
      color: white !important;
    }
    
    .swagger-ui .opblock-tag[data-tag="Usuarios"] {
      background-color: #f9a0a0ff !important;
      color: white !important;
    }

    .swagger-ui .opblock-tag[data-tag="Elementos"] {
      background-color: #87b48fff !important;
      color: white !important;
    }
    
    .swagger-ui .opblock-tag:hover {
      opacity: 0.8;
      transform: scale(1.02);
      transition: all 0.2s ease;
    }
 

    /* Colapsar todas las tags por defecto */
    .swagger-ui .opblock-tag-section.is-open > .opblock-tag {
      margin-bottom: 20;
    }
    
    .swagger-ui .opblock-tag-section:not(.is-open) .no-margin {
      display: none;
    }
    
    .swagger-ui .opblock-tag-section .opblock-tag {
      cursor: pointer;
      border-bottom: 10px solid rgba(59,65,81,.3);
    }
    
    /* Ocultar endpoints por defecto */
    .swagger-ui .opblock-tag-section .no-margin {
      display: none;
    }
    
    /* Mostrar solo cuando la tag tiene clase 'is-open' */
    .swagger-ui .opblock-tag-section.is-open .no-margin {
      display: block;
    }
     
  `,
  customSiteTitle: "API Laboratorio - Documentación",
  customfavIcon: "/favicon.ico"
};

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions
};
