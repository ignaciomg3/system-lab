# 🧪 System-Lab - Sistema de Gestión de Laboratorio de Análisis

## 📋 Descripción General

**System-Lab** es un sistema web integral diseñado para la gestión estadística y operativa de laboratorios de análisis. La aplicación facilita la administración de solicitudes de análisis, seguimiento de muestras, gestión de clientes, y generación de reportes estadísticos, optimizando así los procesos de un laboratorio de análisis químico, microbiológico, bromatológico e industrial.

El sistema permite registrar ingresos de muestras, crear solicitudes de análisis personalizadas, administrar parámetros y plantillas, y mantener un control completo sobre los elementos analizados y los clientes del laboratorio.

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una **arquitectura cliente-servidor** separada en dos aplicaciones independientes:

### **Frontend (FRONT-LAB)**
- **Framework**: Angular 20.1.0 (última versión estable)
- **Tipo**: Single Page Application (SPA)
- **Puerto**: `http://localhost:4200`

### **Backend (BACK-LAB)**
- **Framework**: Node.js con Express.js
- **Tipo**: RESTful API
- **Puerto**: `http://localhost:3000`

### **Base de Datos**
- **Sistema**: MongoDB (NoSQL Document Database)
- **Puerto**: `27017` (puerto predeterminado)
- **Gestión**: MongoDB Compass para administración visual

---

## 🛠️ Stack Tecnológico Completo

### **Frontend (FRONT-LAB)**

#### **Framework y Core**
- **Angular 20.1.0**: Framework principal para la construcción de la SPA
- **TypeScript 5.8.2**: Lenguaje de programación con tipado estático
- **RxJS 7.8.0**: Programación reactiva y manejo de flujos asíncronos
- **Zone.js 0.15.1**: Detección de cambios y contextos de ejecución

#### **Routing y Navegación**
- **Angular Router**: Sistema de navegación SPA con las siguientes rutas:
  - `/home` - Dashboard principal
  - `/new-request` - Nueva solicitud de cotización
  - `/solicitud-analisis` - Solicitud de análisis
  - `/registro-ingresos` - Registro de ingresos de muestras
  - `/sistema/*` - Módulos de sistema (elementos, parámetros, plantillas)
  - `/edit-request` - Edición de solicitudes
  - `/pull-request` - Gestión de peticiones

#### **Formularios y Validación**
- **Angular Forms Module**: Manejo de formularios reactivos y template-driven
- **Two-way Data Binding**: Sincronización automática entre modelo y vista

#### **Estilos y Diseño**
- **CSS Moderno**: Vanilla CSS con características avanzadas
  - CSS Grid y Flexbox para layouts responsivos
  - CSS Custom Properties (variables CSS)
  - Gradientes lineales y radiales
  - Animaciones y transiciones suaves
  - Glassmorphism y efectos modernos
- **Google Fonts**: Tipografía Inter para una apariencia profesional
- **Diseño Responsive**: Adaptable a dispositivos móviles, tablets y escritorio

#### **Herramientas de Desarrollo**
- **Angular CLI 20.1.3**: Interfaz de línea de comandos para desarrollo
- **Karma & Jasmine**: Testing unitario
- **Prettier**: Formateo automático de código con configuración para Angular

---

### **Backend (BACK-LAB)**

#### **Framework y Servidor**
- **Node.js**: Entorno de ejecución de JavaScript del lado del servidor
- **Express.js 4.18.2**: Framework web minimalista y flexible
- **Nodemon 3.0.1**: Recarga automática del servidor en desarrollo (hot-reloading)

#### **Base de Datos y ODM**
- **MongoDB**: Base de datos NoSQL orientada a documentos
- **Mongoose 8.0.0**: ODM (Object Data Modeling) para MongoDB
  - Esquemas y validaciones
  - Middleware de documentos
  - Consultas tipadas

#### **Seguridad**
- **Helmet 7.1.0**: Protección de headers HTTP
- **CORS 2.8.5**: Control de acceso entre orígenes
- **Bcrypt/Bcryptjs**: Hash seguro de contraseñas
- **JSON Web Tokens (JWT) 9.0.2**: Autenticación y autorización basada en tokens
- **Dotenv 16.6.1**: Gestión de variables de entorno

#### **Documentación de API**
- **Swagger UI Express 5.0.1**: Interfaz interactiva de documentación
- **Swagger JSDoc 6.2.8**: Generación de documentación desde comentarios
- **URL de Documentación**: `http://localhost:3000/api-docs`

#### **Logging y Monitoreo**
- **Morgan 1.10.0**: Logger de peticiones HTTP con formato personalizado

---

## 📊 Modelos de Datos (MongoDB Collections)

El sistema gestiona las siguientes colecciones/entidades:

### 1. **Users (Usuarios)**
Gestión de usuarios del sistema con autenticación
- Campos: username, email, password (hasheado), role, timestamps

### 2. **Clientes**
Información de empresas y clientes del laboratorio
- Campos: nombre, CUIT, dirección, contacto, etc.

### 3. **Analisis**
Catálogo de tipos de análisis disponibles
- Campos: nombre, descripción, categoría, precio, tiempo estimado

### 4. **Muestras**
Registro de muestras recibidas en el laboratorio
- Campos: tipo, cantidad, fecha de recepción, estado, cliente

### 5. **Elementos**
Elementos químicos o componentes analizados
- Campos: nombre, descripción, símbolo, categoría

### 6. **Parametros**
Parámetros de configuración del sistema
- Campos: clave, valor, tipo, descripción

### 7. **Plantillas**
Plantillas predefinidas para análisis recurrentes
- Campos: nombre, descripción, análisis incluidos, configuración

### 8. **Estadisticas**
Datos estadísticos y métricas del laboratorio
- Campos: período, tipo, valores, metadatos

---

## 🎯 Funcionalidades Principales

### **Gestión de Solicitudes**
- ✅ **Nueva Solicitud de Cotización**: Formulario para crear cotizaciones con múltiples muestras
- ✅ **Solicitud de Análisis**: Registro formal de análisis con selección de parámetros
- ✅ **Registro de Ingresos**: Control de entrada de muestras al laboratorio
- ✅ **Edición de Solicitudes**: Modificación de solicitudes existentes

### **Administración del Sistema**
- ✅ **Gestión de Elementos**: CRUD completo de elementos analizables
- ✅ **Gestión de Parámetros**: Configuración de parámetros del sistema
- ✅ **Gestión de Plantillas**: Creación y administración de plantillas de análisis
- ✅ **Gestión de Clientes**: Administración de información de clientes

### **Autenticación y Seguridad**
- ✅ **Login JWT**: Sistema de autenticación basado en tokens
- ✅ **Gestión de Usuarios**: CRUD de usuarios con roles
- ✅ **Protección de Rutas**: Middleware de autorización

### **Reportes y Estadísticas**
- ✅ **Dashboard Estadístico**: Visualización de métricas clave
- ✅ **Reportes Personalizados**: Generación de reportes según criterios

---

## 🎨 Características de Diseño UI/UX

### **Estilo Visual**
- **Paleta de Colores Premium**:
  - Gradientes purple (#667eea) a indigo (#764ba2)
  - Acentos verdes para acciones positivas (#48bb78)
  - Tonos neutros modernos (#f8fafc, #e2e8f0)
  
- **Efectos Visuales**:
  - Glassmorphism con backdrop-filter
  - Animaciones suaves con cubic-bezier
  - Sombras multicapa para profundidad
  - Hover states interactivos en todos los elementos

- **Tipografía**:
  - Fuente principal: Inter (Google Fonts)
  - Jerarquía clara de tamaños
  - Letter-spacing optimizado

### **Interactividad**
- Transiciones suaves en todos los elementos (300-600ms)
- Efectos hover con elevación y cambios de color
- Loading states y feedback visual inmediato
- Animaciones de entrada (fade-in, slide-in)

### **Responsive Design**
- Breakpoints: 768px (tablet), 480px (mobile)
- Layouts flexibles con Grid y Flexbox
- Componentes adaptables a cualquier pantalla

---

## 🚀 Flujo de Trabajo de Desarrollo

### **Desarrollo Local**

1. **Iniciar MongoDB**:
   ```bash
   mongod
   ```

2. **Iniciar Backend** (Terminal 1):
   ```bash
   cd BACK-LAB
   npm run dev  # Modo desarrollo con hot-reload
   ```

3. **Iniciar Frontend** (Terminal 2):
   ```bash
   cd FRONT-LAB
   npm start  # Angular Dev Server
   ```

### **Acceso a la Aplicación**
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Documentación Swagger**: http://localhost:3000/api-docs
- **MongoDB Compass**: mongodb://localhost:27017

---

## 📡 API RESTful Endpoints

El backend expone los siguientes grupos de endpoints:

### **Autenticación**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### **Usuarios**
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### **Clientes**
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### **Análisis**
- `GET /api/analisis` - Listar análisis
- `POST /api/analisis` - Crear análisis
- `PUT /api/analisis/:id` - Actualizar análisis
- `DELETE /api/analisis/:id` - Eliminar análisis

### **Muestras**
- `GET /api/muestras` - Listar muestras
- `POST /api/muestras` - Registrar muestra
- `PUT /api/muestras/:id` - Actualizar muestra
- `DELETE /api/muestras/:id` - Eliminar muestra

### **Elementos**
- `GET /api/elementos` - Listar elementos
- `POST /api/elementos` - Crear elemento
- `PUT /api/elementos/:id` - Actualizar elemento
- `DELETE /api/elementos/:id` - Eliminar elemento

### **Parámetros**
- `GET /api/parametros` - Listar parámetros
- `POST /api/parametros` - Crear parámetro
- `PUT /api/parametros/:id` - Actualizar parámetro
- `DELETE /api/parametros/:id` - Eliminar parámetro

### **Plantillas**
- `GET /api/plantillas` - Listar plantillas
- `POST /api/plantillas` - Crear plantilla
- `PUT /api/plantillas/:id` - Actualizar plantilla
- `DELETE /api/plantillas/:id` - Eliminar plantilla

### **Estadísticas**
- `GET /api/estadisticas` - Obtener estadísticas

---

## 🔒 Seguridad Implementada

### **Backend**
- ✅ Helmet para seguridad de headers HTTP
- ✅ CORS configurado para prevenir ataques cross-origin
- ✅ Variables de entorno para credenciales sensibles (.env)
- ✅ Hash de contraseñas con bcrypt (10 rounds)
- ✅ Tokens JWT con expiración configurable
- ✅ Validación de entrada en todos los endpoints
- ✅ Manejo centralizado de errores

### **Frontend**
- ✅ Sanitización de inputs en formularios
- ✅ Validación de datos antes de enviar al servidor
- ✅ Manejo seguro de tokens de autenticación
- ✅ Guards de navegación para rutas protegidas

---

## 📦 Estructura del Proyecto

```
system-lab/
│
├── BACK-LAB/                 # Backend Node.js + Express
│   ├── config/              # Configuraciones (Swagger, DB)
│   ├── models/              # Modelos Mongoose
│   ├── routes/              # Rutas de la API
│   ├── scripts/             # Scripts de utilidad
│   ├── .env                 # Variables de entorno
│   ├── server.js            # Punto de entrada del servidor
│   └── package.json         # Dependencias del backend
│
├── FRONT-LAB/               # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── header/     # Componente de encabezado
│   │   │   ├── pages/      # Páginas de la aplicación
│   │   │   │   ├── home/
│   │   │   │   ├── new-request/
│   │   │   │   ├── solicitud-analisis/
│   │   │   │   ├── registro-ingresos/
│   │   │   │   ├── elementos/
│   │   │   │   ├── parametros/
│   │   │   │   ├── plantillas/
│   │   │   │   └── sistema/
│   │   │   └── services/   # Servicios Angular
│   │   ├── assets/         # Recursos estáticos
│   │   └── styles.css      # Estilos globales
│   └── package.json        # Dependencias del frontend
│
├── data/                    # Datos de MongoDB
├── .gitignore              # Archivos ignorados por Git
└── README.md               # Instrucciones básicas

```

---

## 🌐 Integración Frontend-Backend

### **Comunicación HTTP**
- El frontend consume la API REST del backend vía `HttpClient` de Angular
- Todas las peticiones incluyen headers apropiados (Content-Type, Authorization)
- Manejo de errores con RxJS operators (`catchError`, `retry`)

### **Autenticación**
1. El usuario envía credenciales al endpoint `/api/auth/login`
2. El backend valida y retorna un JWT
3. El frontend almacena el token (localStorage o sessionStorage)
4. Todas las peticiones posteriores incluyen el token en el header Authorization

### **Flujo de Datos**
```
[Usuario] → [Angular Component] → [Angular Service] 
          → [HTTP Request] → [Express Route Handler] 
          → [Mongoose Model] → [MongoDB]
```

---

## 📈 Ventajas Técnicas del Sistema

### **Escalabilidad**
- Arquitectura desacoplada permite escalar frontend y backend independientemente
- MongoDB permite crecimiento horizontal mediante sharding
- API RESTful facilita integración con otros sistemas

### **Mantenibilidad**
- Código TypeScript fuertemente tipado reduce errores
- Separación clara de responsabilidades (MVC en backend)
- Componentes Angular reutilizables y modulares
- Documentación automática con Swagger

### **Performance**
- SPA de Angular para navegación rápida sin recargas
- Lazy loading de módulos en Angular
- Índices en MongoDB para consultas optimizadas
- Caché de respuestas cuando es apropiado

### **Experiencia de Desarrollo**
- Hot-reloading en frontend (Angular) y backend (Nodemon)
- TypeScript proporciona autocompletado inteligente
- Swagger UI para testing de API sin necesidad de Postman
- Mensajes de error descriptivos en consola

---

## 🔮 Tecnologías Modernas Aplicadas

- **Component-Based Architecture**: Angular permite reutilización máxima
- **Reactive Programming**: RxJS para manejo eficiente de eventos asíncronos
- **RESTful API Design**: Estándar de la industria para APIs web
- **NoSQL Database**: Flexibilidad de esquemas para evolución rápida
- **JWT Authentication**: Stateless authentication para escalabilidad
- **Environment Variables**: Configuración segura y flexible
- **API Documentation**: Swagger/OpenAPI para documentación interactiva
- **Modern CSS**: Variables CSS, Grid, Flexbox, Animations
- **ES6+ JavaScript**: Arrow functions, async/await, destructuring

---

## 👥 Casos de Uso del Sistema

### **Laboratorio Químico**
- Registro de muestras de agua, efluentes, suelo
- Análisis de parámetros como pH, conductividad, metales pesados
- Generación de informes para clientes industriales

### **Laboratorio Bromatológico**
- Análisis microbiológicos (coliformes, E. coli, Salmonella)
- Control de calidad de alimentos
- Certificaciones sanitarias

### **Laboratorio Industrial**
- Análisis de materiales y productos
- Control de procesos productivos
- Estudios de toxicidad y composición

---

## 📝 Conclusión

**System-Lab** es un sistema moderno, robusto y escalable construido con las mejores prácticas de desarrollo web. Combina tecnologías de vanguardia tanto en frontend (Angular 20) como en backend (Node.js + Express + MongoDB) para ofrecer una solución completa de gestión para laboratorios de análisis.

El sistema destaca por:
- ✨ **Diseño UI/UX premium** con efectos visuales modernos
- 🔒 **Seguridad robusta** con autenticación JWT y validaciones
- 📚 **Documentación completa** con Swagger interactivo
- 🚀 **Arquitectura escalable** y fácil de mantener
- 🎯 **Funcionalidad completa** para todas las necesidades del laboratorio

---

**Desarrollado con**: Angular 20, Node.js, Express, MongoDB, TypeScript, y mucho ☕

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2025
