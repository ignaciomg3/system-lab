const readline = require('readline');
const open = require('open').default;
const mongoose = require('mongoose');
const Analisis = require('./models/Analisis'); // Importa el modelo de Análisis

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function verificarConexionDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/local', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conexión exitosa a la base de datos');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
  }
}

async function obtenerTotalAnalisis() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/local', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const total = await Analisis.countDocuments();
    console.log(`📊 Número total de análisis en la base de datos: ${total}`);
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error al obtener el total de análisis:', error.message);
  }
}

function mostrarMenu() {
  console.clear();
  console.log('==============================');
  console.log('        MENÚ PRINCIPAL         ');
  console.log('==============================');
  console.log('1. Abrir Swagger (API Docs)');
  console.log('2. Verificar conexión a Base de Datos');
  console.log('3. Obtener total de análisis');
  console.log('0. Salir');
  console.log('------------------------------');
  rl.question('Seleccione una opción: ', async (opcion) => {
    switch (opcion.trim()) {
      case '1':
        console.log('Abriendo Swagger en el navegador...');
        await open('http://localhost:3000/api-docs');
        rl.close();
        break;
      case '2':
        await verificarConexionDB();
        setTimeout(mostrarMenu, 2000);
        break;
      case '3':
        await obtenerTotalAnalisis();
        setTimeout(mostrarMenu, 3000);
        break;
      case '0':
        console.log('Saliendo...');
        rl.close();
        break;
      default:
        console.log('Opción no válida. Intente de nuevo.');
        setTimeout(mostrarMenu, 1500);
        break;
    }
  });
}

mostrarMenu();
