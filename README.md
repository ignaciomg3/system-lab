# 🧪 System-Lab

> **Sistema de Gestión Integral para Laboratorios de Análisis**

Sistema web moderno para la gestión estadística y operativa de laboratorios de análisis químico, microbiológico, bromatológico e industrial.

---

## 🚀 Características Principales

- ✅ **Gestión de Solicitudes**: Cotizaciones y solicitudes de análisis con múltiples muestras
- ✅ **Registro de Ingresos**: Control de muestras recibidas en el laboratorio
- ✅ **Administración de Clientes**: CRUD completo de empresas y contactos
- ✅ **Catálogo de Análisis**: Gestión de tipos de análisis, elementos y parámetros
- ✅ **Plantillas Reutilizables**: Configuraciones predefinidas para análisis frecuentes
- ✅ **Dashboard Estadístico**: Visualización de métricas y reportes
- ✅ **Autenticación JWT**: Sistema seguro de usuarios y roles
- ✅ **API Documentada**: Swagger UI interactivo para explorar endpoints

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **Angular 20.1.0** - Framework SPA con TypeScript
- **RxJS 7.8.0** - Programación reactiva
- **CSS Moderno** - Gradientes, animaciones, glassmorphism
- **Google Fonts (Inter)** - Tipografía premium

### **Backend**
- **Node.js + Express.js** - Servidor API RESTful
- **MongoDB + Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación segura
- **Swagger** - Documentación automática de API
- **Helmet + CORS** - Seguridad y protección

### **Herramientas de Desarrollo**
- **Nodemon** - Hot-reloading en backend
- **Angular CLI** - Herramientas de desarrollo frontend
- **MongoDB Compass** - Gestión visual de base de datos

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (incluido con Node.js)
- **MongoDB** (Community Edition)
- **Git** (opcional, para clonar el repositorio)

---

## ⚙️ Instalación y Configuración

### 1️⃣ **Iniciar MongoDB**

Abre una terminal de Windows y ejecuta:

```bash
mongod
```

> **Nota**: Deja esta terminal abierta mientras uses la aplicación.

Opcionalmente, abre **MongoDB Compass** y conéctate a:
```
mongodb://localhost:27017
```

---

### 2️⃣ **Configurar el Backend**

Abre una **nueva terminal** y ejecuta:

```bash
# Navegar a la carpeta del backend
cd BACK-LAB

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar el servidor en modo desarrollo
npm run dev
```

El backend estará disponible en:
- **API**: http://localhost:3000
- **Documentación Swagger**: http://localhost:3000/api-docs

---

### 3️⃣ **Configurar el Frontend**

Abre **otra terminal** y ejecuta:

```bash
# Navegar a la carpeta del frontend
cd FRONT-LAB

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar la aplicación Angular
npm start
```

El frontend estará disponible en:
- **Aplicación Web**: http://localhost:4200

---

## 🌐 Acceso al Sistema

Una vez iniciados todos los servicios, accede a:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Aplicación Web** | http://localhost:4200 | Interfaz principal del sistema |
| **API Backend** | http://localhost:3000 | Servidor RESTful |
| **Documentación API** | http://localhost:3000/api-docs | Swagger UI interactivo |
| **Base de Datos** | mongodb://localhost:27017 | MongoDB local |

---

## 📂 Estructura del Proyecto

```
system-lab/
│
├── BACK-LAB/           # Backend API (Node.js + Express)
│   ├── config/        # Configuraciones (Swagger, DB)
│   ├── models/        # Modelos de datos (Mongoose)
│   ├── routes/        # Endpoints de la API
│   ├── server.js      # Punto de entrada del servidor
│   └── package.json   # Dependencias backend
│
├── FRONT-LAB/          # Frontend SPA (Angular)
│   ├── src/app/       # Componentes y servicios
│   │   ├── pages/    # Páginas de la aplicación
│   │   └── services/ # Servicios HTTP
│   └── package.json   # Dependencias frontend
│
├── data/              # Archivos de base de datos
└── README.md          # Este archivo
```

---

## 📡 API Endpoints Principales

El backend expone los siguientes grupos de endpoints REST:

- **`/api/auth`** - Autenticación y autorización
- **`/api/users`** - Gestión de usuarios
- **`/api/clientes`** - Administración de clientes
- **`/api/analisis`** - Catálogo de análisis
- **`/api/muestras`** - Registro de muestras
- **`/api/elementos`** - Elementos analizables
- **`/api/parametros`** - Parámetros del sistema
- **`/api/plantillas`** - Plantillas de análisis
- **`/api/estadisticas`** - Reportes y métricas

> Consulta la **documentación completa** en: http://localhost:3000/api-docs

---

## 🎨 Características de Diseño

El sistema cuenta con un diseño UI/UX moderno que incluye:

- 🎨 **Gradientes vibrantes** (Purple #667eea → Indigo #764ba2)
- ✨ **Animaciones suaves** y transiciones fluidas
- 💎 **Efectos glassmorphism** con blur y transparencias
- 📱 **Diseño responsive** adaptable a móviles y tablets
- 🔄 **Hover states interactivos** en todos los elementos
- 🎯 **Tipografía premium** con Google Fonts (Inter)

---

## 🔒 Seguridad

El sistema implementa las siguientes medidas de seguridad:

- ✅ **JWT Authentication** - Tokens seguros para sesiones
- ✅ **Password Hashing** - Bcrypt con 10 salt rounds
- ✅ **Helmet.js** - Protección de headers HTTP
- ✅ **CORS Configurado** - Control de acceso cross-origin
- ✅ **Variables de Entorno** - Credenciales sensibles protegidas
- ✅ **Validación de Entrada** - Sanitización de datos

---

## 📚 Documentación Adicional

Para más información técnica detallada, consulta:

- **[SYSTEM_DESCRIPTION.md](./SYSTEM_DESCRIPTION.md)** - Documentación técnica completa
- **Swagger UI** - http://localhost:3000/api-docs (con el servidor corriendo)

---

## 🐛 Solución de Problemas

### El backend no inicia
- Verifica que MongoDB esté corriendo (`mongod`)
- Comprueba que el puerto 3000 no esté en uso
- Revisa el archivo `.env` en BACK-LAB

### El frontend no carga
- Verifica que el backend esté corriendo primero
- Comprueba que el puerto 4200 no esté en uso
- Ejecuta `npm install` nuevamente en FRONT-LAB

### Error de conexión a MongoDB
- Asegúrate de que `mongod` esté corriendo
- Verifica la URI de MongoDB en `.env` del backend
- Comprueba que el puerto 27017 esté disponible

---

## 🤝 Contribución

Este es un proyecto privado. Para contribuir:

1. Crea una rama con tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Haz commit de tus cambios: `git commit -m 'Agregar nueva funcionalidad'`
3. Push a la rama: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de uso privado y confidencial.

---

## 👨‍💻 Desarrollo

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2025

**Stack**: Angular 20 • Node.js • Express • MongoDB • TypeScript

---

## 📞 Soporte

Para consultas o soporte técnico, contacta al equipo de desarrollo.

---

*Desarrollado con ❤️ para laboratorios de análisis modernos*